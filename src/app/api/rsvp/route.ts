import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { full_name, attending, message, signature_data, locale } = body;

    // Validation
    if (!full_name || typeof full_name !== "string" || full_name.length > 100) {
      return Response.json({ error: "Invalid name" }, { status: 400 });
    }

    if (typeof attending !== "boolean") {
      return Response.json(
        { error: "Invalid attendance value" },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedMessage =
      typeof message === "string" ? message.slice(0, 500) : null;
    const sanitizedSignature =
      typeof signature_data === "string" &&
      signature_data.startsWith("data:image")
        ? signature_data
        : null;

    const { error } = await supabase.from("rsvp").insert({
      full_name: full_name.trim().slice(0, 100),
      attending,
      message: sanitizedMessage,
      signature_data: sanitizedSignature,
      locale: locale === "ar" || locale === "en" ? locale : "ar",
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: "Failed to save RSVP" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("rsvp")
      .select("id, full_name, message, signature_data, attending, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return Response.json(
        { error: "Failed to load guestbook" },
        { status: 500 },
      );
    }

    return Response.json({ data: data || [] });
  } catch {
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}
