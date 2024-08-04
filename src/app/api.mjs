//import OpenAI from "openai";
// require("dotenv").config();

import dotenv from "dotenv";

dotenv.config();

const foodItems = ["mango", "milk", "oats", "yogurt"];
let itemString = "";

  foodItems.map((item) => {
    itemString += `\n${item}`;
  });



async function getResponse(items) {

  console.log(items)

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPEN_ROUTER_API_KEY}`,
          //"HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
          //"X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct:free",
          messages: [
            {
              role: "user",
              content: `Give me a simple recipie with the items\n${items}`,
            },
          ],
          top_p: 1,
          temperature: 1,
          repetition_penalty: 1,
        }),
      }
    );
    const data = await response.json();
    //console.log(data);
    const responseData = data.choices[0].message;
    //console.log(responseData)
    const responseText = responseData.content;
    //console.log(responseText);
    return responseText;
  } catch (err) {
    console.log("Api call unsuccessul");
    console.log(err);
  }
}
//getResponse(itemString);
export {getResponse};
