import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { connectMongoose } from "@/lib/mongoose";
import CrisisReport from "@/models/CrisisReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

type UpdatePayload = {
  status?: unknown;
  urgencyLevel?: unknown;
  assignedAuthority?: unknown;
  authority?: unknown;
  notes?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : undefined;
}

function invalidIdResponse() {
  return NextResponse.json(
    {
      ok: false,
      message: "Invalid crisis report id.",
    },
    { status: 400 },
  );
}

async function readId({ params }: RouteParams) {
  const { id } = await params;
  return id;
}

export async function GET(_request: Request, context: RouteParams) {
  const id = await readId(context);

  if (!isValidObjectId(id)) {
    return invalidIdResponse();
  }

  try {
    await connectMongoose();

    const report = await CrisisReport.findById(id).select("-__v").lean();

    if (!report) {
      return NextResponse.json(
        {
          ok: false,
          message: "Crisis report not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      report,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch crisis report.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteParams) {
  const id = await readId(context);

  if (!isValidObjectId(id)) {
    return invalidIdResponse();
  }

  try {
    const body = (await request.json()) as UpdatePayload;
    const updates: Record<string, string> = {};
    const status = readString(body.status);
    const urgencyLevel = readString(body.urgencyLevel);
    const assignedAuthority =
      readString(body.assignedAuthority) || readString(body.authority);
    const notes = readString(body.notes);

    if (status) {
      updates.status = status;
    }

    if (urgencyLevel) {
      updates.urgencyLevel = urgencyLevel;
    }

    if (assignedAuthority) {
      updates.assignedAuthority = assignedAuthority;
    }

    if (notes) {
      updates.notes = notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Provide at least one field to update: status, urgencyLevel, authority, or notes.",
        },
        { status: 400 },
      );
    }

    await connectMongoose();

    const report = await CrisisReport.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-__v")
      .lean();

    if (!report) {
      return NextResponse.json(
        {
          ok: false,
          message: "Crisis report not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      report,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update crisis report.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteParams) {
  const id = await readId(context);

  if (!isValidObjectId(id)) {
    return invalidIdResponse();
  }

  const deleteToken = process.env.CRISIS_REPORT_DELETE_TOKEN;
  const requestToken = request.headers.get("x-admin-token");

  if (process.env.NODE_ENV === "production" && requestToken !== deleteToken) {
    return NextResponse.json(
      {
        ok: false,
        message: "Delete is restricted to admin/testing use.",
      },
      { status: 403 },
    );
  }

  try {
    await connectMongoose();

    const report = await CrisisReport.findByIdAndDelete(id)
      .select("-__v")
      .lean();

    if (!report) {
      return NextResponse.json(
        {
          ok: false,
          message: "Crisis report not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      ok: true,
      report,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete crisis report.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
