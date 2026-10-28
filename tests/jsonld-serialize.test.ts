import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "@/lib/jsonld";

describe("serializeJsonLd", () => {
  it("never emits a raw < so the data cannot close the script tag", () => {
    const hostile = { name: "</script><script>alert(1)</script>" };
    const out = serializeJsonLd(hostile);
    expect(out).not.toContain("<");
  });

  it("still parses back to the original data", () => {
    const data = { name: "a < b & c", list: ["</script>", 3] };
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
