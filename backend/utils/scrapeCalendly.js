
// New Code ________-------------------------______ 



import puppeteer from "puppeteer-extra";
import dayjs from "dayjs";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

puppeteer.use(StealthPlugin());

const scrapeAvailableDatesAndTimes = async (url,userTimeZone) => {
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode to reduce detection risk
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled", // Prevent detection
    ],
  });




  try {
    const page = await browser.newPage();
  await page.emulateTimezone(userTimeZone);

   
    // ✅ Use a real user-agent to mimic a normal user
    await page.setUserAgent(
      `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${Math.floor(
        Math.random() * (120 - 90 + 1) + 90
      )}.0.0.0 Safari/537.36`
    );

    await page.setViewport({
      width: Math.floor(Math.random() * (1920 - 1280) + 1280),
      height: Math.floor(Math.random() * (1080 - 720) + 720),
      deviceScaleFactor: 1,
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    await closeCookiePopup(page);

    const dateButtonSelector = "button[aria-label*='Times available']";
    const nextMonthBtnSelector = "button[aria-label='Go to next month']";
    const timeSlotSelector = "button[data-container='time-button']";


    dayjs.extend(utc);
    dayjs.extend(timezone);

    // dayjs.extend(userTimeZone);
    const tomorrow = dayjs().tz(userTimeZone).add(1, "day");
    const next7Days = Array.from({ length: 7 }, (_, i) => {
      const date = tomorrow.add(i, "day");
      return {
        fullDate: date.format("YYYY-MM-DD"),
        dayNumber: date.format("D"),
        dayName: date.format("dddd"),
        month: date.format("MMMM"),
      };
    });
    
   
    
    // Get the current month (as defined by your server or desired reference)
    const currentMonth = dayjs().format("MMMM");
  
    
    
    // Divide the days into current month and next month groups:
    const currentMonthDays = next7Days.filter(day => day.month === currentMonth);
    const nextMonthDays = next7Days.filter(day => day.month !== currentMonth);
    
    console.log("Current Month Days:", currentMonthDays);
    console.log("Next Month Days:", nextMonthDays);

    
    
    // ✅ Extract available dates from the page
    const extractDates = async () => {
      return await page.evaluate((selector) => {
        return Array.from(document.querySelectorAll(selector)).map((btn) => ({
          dayText: btn.innerText.trim(),
          ariaLabel: btn.getAttribute("aria-label") || "",
        }));
      }, dateButtonSelector);
    };

    let availableDates = await extractDates();
    // console.log("📆 Initial Available Dates:", availableDates);



    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));



     // Helper function: click a date button and extract its time slots
     const extractTimeSlotsForDay = async (day) => {
      // Construct a robust selector based on the expected aria-label format
      const dateButtonSelector = `button[aria-label*='${day.dayName}, ${day.month} ${day.dayNumber} - Times available']`;
      console.log(`🔎 Looking for date button with selector: ${dateButtonSelector}`);
      
      // Wait for the date button to appear
      await page.waitForSelector(dateButtonSelector, { visible: true, timeout: 1000 }).catch(() => {
        console.log(`❌ Date button not found for ${day.fullDate}`);
      });
      
      const dateButton = await page.$(dateButtonSelector);
      if (!dateButton) {
        return [];
      }
      
      // Scroll into view and click the date button
      await page.evaluate(el => el.scrollIntoView({ behavior: "smooth", block: "center" }), dateButton);
      await delay(500);
      await dateButton.click();
      console.log(`✅ Clicked date: ${day.fullDate}`);
      
      // Wait for time slots to load (adjust timeout as needed)
      await page.waitForSelector(timeSlotSelector, { visible: true, timeout: 10000 }).catch(() => {
        console.log(`⚠️ No time slots found for ${day.fullDate}`);
      });
      await delay(1000); // Extra delay to ensure the new times are loaded
      
      // Extract available time slots
      const timeSlots = await page.evaluate((selector) => {
        return Array.from(document.querySelectorAll(selector))
          .map(btn => btn.getAttribute("data-start-time"))
          .filter(time => time !== null);
      }, timeSlotSelector);
      
     
      return timeSlots;
    };
    
    


    let finalResults = [];


      //  Phase 1: Process current month days
       console.log("Processing current month days...");
       for (let day of currentMonthDays) {

         let timeSlots = await extractTimeSlotsForDay(day);
         finalResults.push({ date: day.fullDate, dayName: day.dayName, times: timeSlots });
         // Refresh availableDates for consistency after a click
         availableDates = await extractDates();
       }
   
       // Phase 2: Process next month days (if any)
       if (nextMonthDays.length > 0) {
        console.log("Clicking 'Next Month' to process next month days...");
        
        await page.waitForSelector(nextMonthBtnSelector, { timeout: 5000 });
        const nextMonthBtn = await page.$(nextMonthBtnSelector);
      
        if (nextMonthBtn) {
          await nextMonthBtn.click();
          await delay(2000); // Ensure the next month is loaded
        } else {
          console.log("Next Month button not found.");
        }
      
        // Ensure availableDates updates correctly
        await delay(2000);  // Extra wait time for new month to load
        availableDates = await extractDates();
        
      
        for (let day of nextMonthDays) {
          // console.log(`Processing ${day.fullDate} (next month)`);
      
      
          let timeSlots = await extractTimeSlotsForDay(day);
          // console.log(`Extracted timeslots for ${day.fullDate}:`, timeSlots);
          
          finalResults.push({ date: day.fullDate, dayName: day.dayName, times: timeSlots });
      
          // Re-extract available dates after each click
          // availableDates = await extractDates();
        }
      
        
      }
      
    // _____________________________-


    return finalResults;

// _____________________________________________


// ------------------------------------


  } catch (error) {
    console.error("Error:", error);
    return [];
  } 
  finally {
    await browser.close();
  }
};

const closeCookiePopup = async (page) => {
  try {
    const closeButtonSelector = "#onetrust-close-btn-container .onetrust-close-btn-handler";
    await page.waitForSelector(closeButtonSelector, { timeout: 5000 }).catch(() => null);

    const popupButton = await page.$(closeButtonSelector);
    if (popupButton) {
      await popupButton.click();
      // await page.waitForTimeout(Math.random() * 2000 + 1000);cl
      await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000)); // ✅ Works in all versions

    }
  } catch (error) {
    console.error("Error closing cookie popup:", error);
  }
};

export default scrapeAvailableDatesAndTimes;
          


