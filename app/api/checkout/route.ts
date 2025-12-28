
import { NextResponse } from "next/server";
import crypto from "crypto";
import { redirect } from "next/dist/server/api-utils";

const PHONEPE_BASE_URL = process.env.PHONEPE_PRE_PROD_BASEURL || "https://api-preprod.phonepe.com";
const AUTH_URL = process.env.PHONEPE_PRE_PROD_AUTH_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
const PAY_URL = process.env.PHONEPE_PRE_PROD_PAY_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";


const CLIENT_ID = process.env.PHONEPE_PRE_PROD_CLIENT_ID;
const CLIENT_SECRET = process.env.PHONEPE_PRE_PROD_CLIENT_SECRET;
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || "PGTESTPAYUAT";


export async function POST(request: Request) {
  try {
    const { amount, customerName, customerPhone, items } = await request.json();
    console.log("Request Data :", amount, customerName, customerPhone, items);

    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("Missing PhonePe Credentials");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }
    else {
      console.log("PhonePe Credentials Acquired");
    }


    const authRequestHeaders = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const authRequestBodyJSON = {
      "client_version": "1",
      "grant_type": "client_credentials",
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_SECRET
    };

    const authRequestBody = new URLSearchParams(authRequestBodyJSON).toString();

    // Note: PhonePe Sandbox often requires specific headers or body. 
    // For client_credentials, Basic Auth is standard.
    const tokenResponse = await fetch(AUTH_URL, {
      method: "POST",
      headers: authRequestHeaders,
      body: authRequestBody,
    });


    const tokenData = await tokenResponse.json();

    console.log("PhonePe AUTH Token Response Received", tokenData);
    const accessToken = tokenData.access_token;

    // // 2. Create Order
    const orderId = `ORD${Date.now()}`;


    const origin = new URL(request.url).origin;
    // const origin = "http://10.119.177.67:3000";

    // // Amount must be in Paisa (Integer)
    const amountInPaisa = Math.round(amount * 100);


    const payRequestHeaders = {
      "Content-Type": "application/json",
      "Authorization": `O-Bearer ${accessToken}`
    }

    const payRequestBody = {
      merchantOrderId: orderId,
      amount: amountInPaisa,
      expireAfter: 300,
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment Request",
        merchantUrls: {
          redirectUrl: `${origin}/order/${orderId}`
        }
      },
      metaInfo: {
        udf1: `${customerName}`,
        udf2: `${customerPhone}`,
      }

    }

    const payResponse = await fetch(PAY_URL, {
      method: "POST",
      headers: payRequestHeaders,
      body: JSON.stringify(payRequestBody)
    });


    const payData = await payResponse.json();


    // Save Order to 
    const orderData = {
      orderId: orderId,
      amount: amount,
      customerName: customerName,
      customerPhone: customerPhone,
      items: items,
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    };



    if (!payData.redirectUrl) {
      console.error("PhonePe PAY Response Received", payData);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
    else {
      console.log("PhonePe PAY Response Received", payData);
    }

    const redirectUrl = payData.redirectUrl;





    return NextResponse.json({ redirectUrl, orderId });

  } catch (error) {
    console.error("Checkout Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}