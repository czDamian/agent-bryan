import { DataAPIClient } from "@datastax/astra-db-ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

import dotenv from "dotenv";
dotenv.config();
const {
  GEMINI_API_KEY,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_CHAT_HISTORY_COLLECTION
} = process.env;

// Initialize the client and model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

if (!ASTRA_DB_API_ENDPOINT || !ASTRA_DB_APPLICATION_TOKEN) {
  throw new Error("Missing Astra DB connection details in .env");
}

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async () => {
  const res = await db.createCollection(ASTRA_DB_CHAT_HISTORY_COLLECTION, {
    vector: {
      dimension: 768, //1536 is for openAI, 768 is for gemini
      metric: "dot_product",
    },
  });
  console.log("Collection created:", res);
};
// createCollection();

(async () => {
  const colls = await db.listCollections();
  console.log("Connected to AstraDB:", colls);
})();

const bryanSites = [
  "https://blueprint.bryanjohnson.com/",
  "https://blueprint.bryanjohnson.com/pages/blueprint-protocol",
  "https://blueprint.bryanjohnson.com/pages/help-center?hcUrl=%2Fen-US",
  "https://blueprint.bryanjohnson.com/collections/supplements",
  "https://blueprint.bryanjohnson.com/pages/biomarkers",
  "https://blueprint.bryanjohnson.com/collections/meals-snacks",
  "https://blueprint.bryanjohnson.com/collections/merch",
  "https://blueprint.bryanjohnson.com/collections/all-products",
  "https://blueprint.bryanjohnson.com/pages/about",
  "https://dontdieapp.com/",
  "https://dontdieapp.notion.site/",
  "https://dontdie.com/",
  "https://blueprint.bryanjohnson.com/blogs/news"
];

const scrapePage = async (url) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const res = await page.evaluate(() => document.body.innerHTML);
      browser.close;
      return res;
    },
  });
  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

const loadSampleData = async () => {
  const collection = db.collection(ASTRA_DB_COLLECTION);
  for await (const url of bryanSites) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);

    for await (const chunk of chunks) {
      const resultEmbedding = await model.embedContent(chunk);

      const data = resultEmbedding.embedding.values;
      console.log("data", data);
      const res = await collection.insertOne({
        $vector: data,
        text: chunk,
      });
      console.log("res", res);
    }
  }
};

// loadSampleData();
