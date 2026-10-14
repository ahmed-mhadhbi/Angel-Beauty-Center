import { test, expect } from "@playwright/test";

for (const width of [1440, 390])
  test(`package upgrades, validation, complete booking, persistence and owner status at ${width}px`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await page
      .locator(".package-card")
      .filter({ hasText: "تجربة Angel VIP" })
      .getByRole("button")
      .click();
    await expect(page.locator(".selection-summary")).toContainText("٢٬١٠٠");
    await expect(
      page.getByRole("button", { name: /عناية بالوجه/ }),
    ).toBeDisabled();
    await page.getByRole("button", { name: /وقت أطول ليكي/ }).click();
    await expect(page.locator(".selection-summary")).toContainText("٢٬٣٠٠");
    await page.getByRole("button", { name: "كمّلي لطلب الحجز" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("اختاري يومًا");
    await dialog
      .locator(".calendar-grid button:not([disabled])")
      .first()
      .click();
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("اختاري الوقت");
    await dialog.getByRole("button", { name: "٣:٠٠ عصرًا" }).click();
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await dialog.getByLabel("الاسم الأول").fill("ليلى");
    await dialog.getByLabel("رقم الموبايل").fill("123");
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "رقم موبايل مصري صحيح",
    );
    await dialog.getByLabel("رقم الموبايل").fill("٠١٠١٢٣٤٥٦٧٨");
    await dialog.getByLabel(/حابة تضيفي حاجة/).fill("عرض توضيحي للتجربة");
    await dialog.getByRole("button", { name: "كمّلي", exact: true }).click();
    await expect(dialog.locator(".deposit-preview")).toContainText("٥٧٥");
    await page.screenshot({ path: `test-results/booking-review-${width}.png` });
    await dialog.getByRole("button", { name: "حفظ الطلب التجريبي" }).click();
    await expect(dialog.locator(".request-success")).toBeVisible();
    await expect(dialog.getByLabel("رسالة طلب الحجز")).toContainText("ليلى");
    await dialog.getByRole("button", { name: "نسخ طلب الحجز" }).click();
    await expect(
      dialog.getByRole("button", { name: "تم نسخ الطلب" }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
      "تجربة Angel VIP",
    );
    await dialog.getByRole("link", { name: /شوفي الطلب/ }).click();
    await expect(page).toHaveURL(/owner-demo/);
    const row = page.getByRole("row").filter({ hasText: "ليلى" });
    await expect(row).toContainText("٢٬٣٠٠");
    await row.getByRole("combobox").selectOption("confirmed");
    await page.reload();
    await expect(
      page.getByRole("row").filter({ hasText: "ليلى" }).getByRole("combobox"),
    ).toHaveValue("confirmed");
    await page
      .getByRole("combobox", { name: "تصفية الطلبات" })
      .selectOption("visitor");
    await expect(page.locator("tbody tr")).toHaveCount(1);
    expect(errors).toEqual([]);
  });

test("gift personalization, designs and printable voucher", async ({
  page,
}) => {
  await page.goto("/#gifts");
  await page.getByRole("button", { name: "صمّمي هديتك" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("اسم اللي هتفرحيها").fill("نور");
  await dialog
    .getByLabel("رسالة من القلب")
    .fill("كل سنة وإنتِ طيبة يا نور، وقت ليكي إنتِ وبس.");
  await dialog.getByRole("button", { name: "رملي", exact: true }).click();
  await expect(page.locator("#print-voucher")).toHaveClass(/sand/);
  await expect(page.locator("#print-voucher")).toContainText("لـ نور");
  await page.screenshot({ path: "test-results/gift-preview.png" });
  await page.evaluate(() => {
    window.print = () => {
      document.body.dataset.printRequested = "yes";
    };
  });
  await dialog.getByRole("button", { name: "طباعة / حفظ PDF" }).click();
  await expect(page.locator("body")).toHaveAttribute(
    "data-print-requested",
    "yes",
  );
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: "test-results/voucher.pdf",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.emulateMedia({ media: "screen" });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

test("revenue arithmetic, editable reminders, presentation and reset", async ({
  page,
}) => {
  await page.goto("/owner-demo");
  await expect(page.locator(".main-result")).toContainText("٢٦٬١٠٠");
  await page.locator("input[type=range]").nth(2).fill("50");
  await expect(page.locator(".main-result")).toContainText("٤٣٬٥٠٠");
  await expect(page.locator(".result-details")).toContainText("٢٤٬٦٠٠");
  await page.locator(".calculator-extra input").first().fill("");
  await expect(page.locator(".result-details")).toContainText("أدخلي الهامش");
  await page
    .getByLabel("قالب قابل للتعديل")
    .fill("أهلًا {name}، موعدك {date} الساعة {time}.");
  await expect(page.locator(".reminder-preview")).toContainText("أهلًا سارة");
  await page.getByRole("button", { name: "حفظ ومحاكاة إشعار" }).click();
  await page.reload();
  await expect(page.getByLabel("قالب قابل للتعديل")).toHaveValue(
    "أهلًا {name}، موعدك {date} الساعة {time}.",
  );
  await page.getByRole("button", { name: "ابدئي العرض" }).click();
  await expect(page.locator(".present-bar")).toContainText(
    "القيمة لصاحبة المركز",
  );
  await page.screenshot({
    path: "test-results/owner-presentation.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "إنهاء وضع العرض" }).click();
  await page
    .getByRole("button", { name: "إعادة ضبط العرض", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "إعادة ضبط العرض", exact: true })
    .click();
  await expect(page.getByLabel("قالب قابل للتعديل")).toHaveValue(/بنفكّرك/);
  await expect(page.locator("tbody tr")).toHaveCount(3);
  await expect(page.locator(".main-result")).toContainText("٢٦٬١٠٠");
});

for (const width of [1440, 768, 390, 360])
  test(`visual and layout checks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 1000 ? 1000 : 844 });
    const failures: string[] = [];
    page.on("pageerror", (e) => failures.push(e.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".hero-image")).toBeVisible();
    await expect
      .poll(() =>
        page
          .locator(".hero-image")
          .evaluate((img: HTMLImageElement) => img.naturalWidth),
      )
      .toBeGreaterThan(0);
    await page.screenshot({ path: `test-results/home-${width}.png` });
    for (const id of ["sanctuary", "packages", "enhancements", "gifts"]) {
      await page.locator("#" + id).scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
    }
    await page.locator("#packages").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `test-results/packages-${width}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    const broken = await page
      .locator("img")
      .evaluateAll((imgs) =>
        imgs
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.src),
      );
    expect(broken).toEqual([]);
    if (width < 650) {
      await page.getByRole("button", { name: "فتح القائمة" }).click();
      await page
        .locator(".nav-links")
        .getByRole("link", { name: "الجناح الخاص" })
        .click();
      await expect(page.locator(".nav-links")).not.toBeVisible();
      await page.locator(".mobile-sticky").click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
    }
    await page.goto("/owner-demo");
    await page.screenshot({ path: `test-results/owner-${width}.png` });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    expect(failures).toEqual([]);
  });
