import "./types/List"
import "./types/Item"
import "./types/ListItem"
import "./types/User"
import { builder } from "@/graphql/builder"

export const schema = builder.toSchema()