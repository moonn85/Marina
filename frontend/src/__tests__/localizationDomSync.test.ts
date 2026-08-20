// @vitest-environment jsdom
import { describe, expect, it, beforeEach } from "vitest";
import { translateDocument } from "@/localization";

/**
 * Lớp dịch DOM cache lại "source" của mỗi text node ở lần quét đầu tiên.
 * Trước đây nó luôn dịch lại theo source cũ, nên mọi text do React cập nhật
 * sau lần render đầu (đếm số ở hero, giá phòng, ngày đã chọn) đều bị ghi đè
 * ngược về giá trị render đầu tiên.
 */
describe("translateDocument", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("không ghi đè ngược giá trị mới do React render", () => {
    const strong = document.createElement("strong");
    strong.textContent = "0";
    document.body.appendChild(strong);

    // Lần quét đầu: node được cache với source "0".
    translateDocument("vi");
    expect(strong.textContent).toBe("0");

    // React cập nhật text tại chỗ qua nodeValue (giữ nguyên Text node),
    // đúng như khi count-up chạy xong.
    strong.firstChild!.nodeValue = "24/7";

    // Observer quét lại -> phải giữ nguyên "24/7", không quay về "0".
    translateDocument("vi");
    expect(strong.textContent).toBe("24/7");
  });

  it("giữ được giá phòng sau khi fetch xong", () => {
    const button = document.createElement("button");
    button.textContent = "Tìm phòng";
    document.body.appendChild(button);

    translateDocument("vi");
    button.firstChild!.nodeValue = "1.567.500₫";
    translateDocument("vi");

    expect(button.textContent).toBe("1.567.500₫");
  });

  it("vẫn bỏ qua node nằm trong [data-no-localize]", () => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-no-localize", "");
    wrapper.textContent = "Giữ nguyên";
    document.body.appendChild(wrapper);

    translateDocument("en");

    expect(wrapper.textContent).toBe("Giữ nguyên");
  });
});
