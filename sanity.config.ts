import { defineConfig } from "sanity";
import { codeInput } from "@sanity/code-input";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "boholvending";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "bohol_content_studio",
  title: "BOHOL Content Studio",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [structureTool(), codeInput()],
  schema: { types: schemaTypes },
});
