"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface Message {
  type: "bot" | "user";
  text: string;
  toolSlug?: string;
  toolName?: string;
}

interface Pattern {
  keywords: string[];
  tool: string;
  name: string;
  response: string;
}

const patterns: Pattern[] = [
  // EMI & Loans
  { keywords: ["emi", "equated monthly", "monthly installment"], tool: "emi-calculator", name: "EMI Calculator", response: "For EMI calculation, use our EMI Calculator! It works for home loans, car loans, personal loans, and more." },
  { keywords: ["home loan", "housing loan", "mortgage"], tool: "home-loan-calculator", name: "Home Loan Calculator", response: "Calculate your home loan EMI, total interest and year-wise breakdown with our Home Loan Calculator!" },
  { keywords: ["car loan", "auto loan", "vehicle loan"], tool: "car-loan-calculator", name: "Car Loan Calculator", response: "Calculate your car loan EMI, total interest and payment schedule with our Car Loan Calculator!" },
  { keywords: ["education loan", "student loan", "study loan"], tool: "education-loan-calculator", name: "Education Loan Calculator", response: "Plan your education loan with moratorium period and total cost using our Education Loan Calculator!" },
  { keywords: ["loan eligibility", "max loan", "how much loan"], tool: "loan-eligibility-calculator", name: "Loan Eligibility Calculator", response: "Find out your maximum eligible loan amount based on income with our Loan Eligibility Calculator!" },

  // SIP & Investments
  { keywords: ["sip", "systematic investment", "mutual fund invest"], tool: "sip-calculator", name: "SIP Calculator", response: "Our SIP Calculator can help you plan your mutual fund investments and see how your money grows!" },
  { keywords: ["mutual fund", "fund returns"], tool: "mutual-fund-calculator", name: "Mutual Fund Calculator", response: "Calculate SIP and Lumpsum mutual fund returns with our Mutual Fund Calculator!" },
  { keywords: ["lumpsum", "one time investment"], tool: "lumpsum-calculator", name: "Lumpsum Calculator", response: "Calculate returns on your one-time investment with our Lumpsum Calculator!" },
  { keywords: ["swp", "systematic withdrawal"], tool: "swp-calculator", name: "SWP Calculator", response: "Plan your monthly withdrawals from investments with our SWP Calculator!" },
  { keywords: ["elss", "tax saving fund", "80c mutual"], tool: "elss-tax-calculator", name: "ELSS Tax Calculator", response: "Calculate ELSS returns with Section 80C tax savings using our ELSS Tax Calculator!" },

  // Income Tax
  { keywords: ["income tax", "tax calculator", "salary tax", "new regime", "old regime", "tax saving"], tool: "income-tax-calculator", name: "Income Tax Calculator", response: "Use our Income Tax Calculator to compare Old vs New regime and find which saves you more!" },

  // GST
  { keywords: ["gst calculator", "goods and services tax", "gst rate", "gst amount"], tool: "gst-calculator", name: "GST Calculator", response: "Our GST Calculator handles 5%, 12%, 18%, and 28% rates. Calculate inclusive and exclusive GST instantly!" },
  { keywords: ["gst invoice", "gst bill", "cgst sgst"], tool: "gst-invoice-generator", name: "GST Invoice Generator", response: "Generate formatted GST invoices with CGST/SGST breakdown using our GST Invoice Generator!" },
  { keywords: ["gst number", "gstin", "gst validate"], tool: "gst-number-validator", name: "GST Number Validator", response: "Validate any GSTIN and extract state, PAN and entity details with our GST Number Validator!" },

  // Age
  { keywords: ["age", "how old", "birthday", "date of birth", "dob"], tool: "age-calculator", name: "Age Calculator", response: "The Age Calculator gives your exact age in years, months, and days!" },

  // Percentage
  { keywords: ["percentage", "percent", "marks percentage"], tool: "percentage-calculator", name: "Percentage Calculator", response: "Our Percentage Calculator handles all types -- marks percentage, increase/decrease, and more!" },

  // Image Tools
  { keywords: ["compress image", "image size", "reduce photo", "photo compress", "50kb", "100kb", "image compress"], tool: "image-compressor", name: "Image Compressor", response: "Our Image Compressor can reduce your photo to any size -- 20KB, 50KB, 100KB. Perfect for government forms!" },
  { keywords: ["resize image", "image dimensions", "scale image"], tool: "image-resizer", name: "Image Resizer", response: "Resize your images to exact dimensions or percentage with our Image Resizer!" },
  { keywords: ["crop image", "cut image", "trim image"], tool: "image-cropper", name: "Image Cropper", response: "Crop your images to custom dimensions with our Image Cropper!" },
  { keywords: ["convert image", "jpg to png", "png to jpg", "image format", "webp"], tool: "image-format-converter", name: "Image Format Converter", response: "Convert between JPG, PNG, WebP, and more with our Image Format Converter!" },
  { keywords: ["passport photo", "passport size", "id photo", "aadhaar photo", "visa photo"], tool: "passport-photo-maker", name: "Passport Photo Maker", response: "Create perfect passport-size photos for Indian passport, Aadhaar, PAN, and visa!" },
  { keywords: ["background remov", "remove bg", "transparent"], tool: "background-remover", name: "Background Remover", response: "Remove backgrounds from your images with our Background Remover!" },
  { keywords: ["watermark", "image watermark"], tool: "image-watermark", name: "Image Watermark", response: "Add custom text watermarks to your images for protection!" },

  // PDF Tools
  { keywords: ["merge pdf", "combine pdf", "join pdf"], tool: "merge-pdf", name: "Merge PDF", response: "Use our PDF Merge tool to combine multiple PDF files into one!" },
  { keywords: ["split pdf", "extract page", "separate pdf"], tool: "split-pdf", name: "Split PDF", response: "Our PDF Split tool lets you extract specific pages from any PDF!" },
  { keywords: ["compress pdf", "reduce pdf", "pdf size", "pdf smaller"], tool: "compress-pdf", name: "Compress PDF", response: "Compress your PDF files to reduce size without losing quality!" },
  { keywords: ["pdf to word", "pdf text", "extract pdf"], tool: "pdf-to-word", name: "PDF to Word", response: "Extract text from PDF files and convert to editable documents!" },
  { keywords: ["image to pdf", "photo to pdf", "jpg to pdf"], tool: "image-to-pdf", name: "Image to PDF", response: "Convert your images to PDF with proper page sizes using our Image to PDF tool!" },

  // Word Counter
  { keywords: ["word count", "character count", "count words", "essay word"], tool: "word-counter", name: "Word Counter", response: "Our Word Counter shows word count, character count, sentence count, and reading time!" },

  // Password
  { keywords: ["password generate", "strong password", "random password"], tool: "password-generator", name: "Password Generator", response: "Generate strong, uncrackable passwords with our Password Generator!" },
  { keywords: ["password strength", "password check"], tool: "password-strength-checker", name: "Password Strength Checker", response: "Check how strong your password is and get improvement tips!" },

  // HRA
  { keywords: ["hra", "house rent allowance", "rent allowance", "hra exemption", "hra tax"], tool: "hra-calculator", name: "HRA Calculator", response: "Calculate your exact HRA tax exemption with our HRA Calculator!" },

  // PPF
  { keywords: ["ppf", "public provident", "provident fund"], tool: "ppf-calculator", name: "PPF Calculator", response: "See how your PPF investment grows over 15 years with our PPF Calculator!" },

  // FD
  { keywords: ["fd calculator", "fixed deposit", "fd interest", "fd rate", "fd maturity"], tool: "fd-calculator", name: "FD Calculator", response: "Calculate your FD maturity amount and interest earned with our FD Calculator!" },
  { keywords: ["fd comparison", "best fd", "compare fd"], tool: "fd-comparison", name: "FD Comparison", response: "Compare FD rates across 10 major Indian banks with our FD Comparison tool!" },

  // NPS
  { keywords: ["nps", "national pension", "pension calculator"], tool: "nps-calculator", name: "NPS Calculator", response: "Plan your retirement with our NPS Calculator -- see your pension amount at retirement!" },

  // Salary
  { keywords: ["salary", "ctc", "in hand", "take home", "in-hand", "net salary"], tool: "salary-calculator", name: "Salary Calculator", response: "Find your exact take-home salary from CTC with our Salary Calculator!" },
  { keywords: ["salary hike", "appraisal", "increment"], tool: "salary-hike-calculator", name: "Salary Hike Calculator", response: "Calculate your new salary after a percentage hike with our Salary Hike Calculator!" },

  // Gratuity
  { keywords: ["gratuity", "years of service"], tool: "gratuity-calculator", name: "Gratuity Calculator", response: "Calculate your gratuity amount based on years of service and last drawn salary!" },

  // QR Code
  { keywords: ["qr code", "qr generate", "barcode"], tool: "qr-code-generator", name: "QR Code Generator", response: "Generate QR codes for any URL, text, UPI ID, or WiFi password!" },
  { keywords: ["upi qr", "upi payment", "gpay qr", "phonepe qr"], tool: "upi-qr-generator", name: "UPI QR Generator", response: "Generate UPI payment QR codes for GPay, PhonePe, Paytm and more!" },

  // JSON
  { keywords: ["json format", "beautify json", "validate json", "json formatter"], tool: "json-formatter", name: "JSON Formatter", response: "Format, validate, and beautify your JSON data with our JSON Formatter!" },

  // BMI
  { keywords: ["bmi", "body mass", "obesity", "overweight"], tool: "bmi-calculator", name: "BMI Calculator", response: "Check your BMI and health status with our BMI Calculator!" },

  // Currency
  { keywords: ["currency", "dollar to rupee", "usd to inr", "exchange rate", "convert currency"], tool: "currency-converter", name: "Currency Converter", response: "Convert currencies with live exchange rates using our Currency Converter!" },

  // IFSC
  { keywords: ["ifsc", "bank code", "neft", "rtgs", "bank branch"], tool: "ifsc-bank-details", name: "IFSC Bank Details", response: "Look up any IFSC code to find bank branch details, address, and MICR code!" },

  // Compound & Simple Interest
  { keywords: ["compound interest", "ci calculator"], tool: "compound-interest-calculator", name: "Compound Interest Calculator", response: "Calculate compound interest with our easy-to-use calculator!" },
  { keywords: ["simple interest", "si calculator"], tool: "simple-interest-calculator", name: "Simple Interest Calculator", response: "Calculate simple interest quickly with our Simple Interest Calculator!" },

  // Resume
  { keywords: ["resume", "cv builder", "curriculum vitae"], tool: "ai-resume-bullet-points", name: "AI Resume Bullet Points", response: "Transform your job descriptions into achievement-oriented resume bullet points!" },

  // Text tools
  { keywords: ["case convert", "uppercase", "lowercase", "title case"], tool: "case-converter", name: "Case Converter", response: "Convert text between UPPERCASE, lowercase, Title Case and more!" },
  { keywords: ["lorem ipsum", "dummy text", "placeholder text"], tool: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", response: "Generate placeholder text for design and development!" },

  // Electricity
  { keywords: ["electricity", "electric bill", "power bill", "bijli bill"], tool: "electricity-bill-calculator", name: "Electricity Bill Calculator", response: "Calculate your electricity bill based on your state's rates!" },

  // Credit Score
  { keywords: ["credit score", "cibil"], tool: "credit-score-estimator", name: "Credit Score Estimator", response: "Estimate your CIBIL credit score based on your financial habits!" },

  // Color tools
  { keywords: ["color pick", "hex to rgb", "color convert"], tool: "color-picker", name: "Color Picker", response: "Pick colors and convert between HEX, RGB, HSL formats with our Color Picker!" },
  { keywords: ["css gradient", "gradient generator"], tool: "css-gradient-generator", name: "CSS Gradient Generator", response: "Create beautiful CSS gradients with live preview!" },

  // Converters
  { keywords: ["length convert", "meter to feet", "feet to meter", "cm to inch"], tool: "length-converter", name: "Length Converter", response: "Convert between meters, feet, inches, cm, km, miles and more!" },
  { keywords: ["weight convert", "kg to pound", "pound to kg"], tool: "weight-converter", name: "Weight Converter", response: "Convert between kg, pounds, ounces, grams and more!" },
  { keywords: ["temperature convert", "celsius", "fahrenheit"], tool: "temperature-converter", name: "Temperature Converter", response: "Convert between Celsius, Fahrenheit and Kelvin!" },

  // WhatsApp
  { keywords: ["whatsapp link", "wa.me", "whatsapp message"], tool: "whatsapp-link-generator", name: "WhatsApp Link Generator", response: "Generate wa.me links with pre-filled messages and QR codes!" },

  // Health
  { keywords: ["calorie", "diet", "weight loss", "calorie intake"], tool: "calorie-calculator", name: "Calorie Calculator", response: "Calculate daily calorie intake for weight loss, gain or maintenance!" },
  { keywords: ["pregnancy", "due date", "conception"], tool: "pregnancy-calculator", name: "Pregnancy Calculator", response: "Calculate your due date and track pregnancy week by week!" },
  { keywords: ["sleep calculator", "bedtime", "wake up time"], tool: "sleep-calculator", name: "Sleep Calculator", response: "Find your optimal bedtime or wake time based on sleep cycles!" },

  // Typing test
  { keywords: ["typing", "typing speed", "wpm", "typing test"], tool: "typing-speed-test", name: "Typing Speed Test", response: "Test your typing speed and accuracy with our Typing Speed Test!" },

  // Love calculator
  { keywords: ["love calculator", "love compatibility", "crush"], tool: "love-calculator", name: "Love Calculator", response: "Check your love compatibility percentage with our fun Love Calculator!" },

  // Date tools
  { keywords: ["date difference", "days between", "how many days"], tool: "date-difference-calculator", name: "Date Difference Calculator", response: "Calculate the exact difference between two dates in days, months and years!" },
  { keywords: ["countdown", "days left", "event countdown"], tool: "countdown-timer", name: "Countdown Timer", response: "Create a countdown timer to any future date or event!" },

  // Gold
  { keywords: ["gold price", "gold calculator", "gold value", "karat"], tool: "gold-price-calculator", name: "Gold Price Calculator", response: "Calculate gold value based on weight, purity (karat) and current price!" },

  // Stamp duty
  { keywords: ["stamp duty", "registration charge", "property registration"], tool: "stamp-duty-calculator", name: "Stamp Duty Calculator", response: "Calculate stamp duty and registration charges state-wise in India!" },

  // Solar
  { keywords: ["solar panel", "solar calculator", "rooftop solar"], tool: "solar-panel-calculator", name: "Solar Panel Calculator", response: "Calculate solar panel system size, cost, savings and payback period!" },

  // Fuel
  { keywords: ["fuel cost", "petrol cost", "diesel cost", "trip cost"], tool: "fuel-cost-calculator", name: "Fuel Cost Calculator", response: "Calculate fuel cost for your trip based on distance, mileage and fuel price!" },
  { keywords: ["mileage", "km per liter", "fuel efficiency"], tool: "mileage-calculator", name: "Mileage Calculator", response: "Calculate your vehicle's mileage and cost per kilometer!" },

  // SEO
  { keywords: ["meta tag", "seo tag"], tool: "meta-tag-generator", name: "Meta Tag Generator", response: "Generate SEO-friendly meta tags for your website!" },
  { keywords: ["sitemap", "xml sitemap"], tool: "sitemap-generator", name: "XML Sitemap Generator", response: "Generate an XML sitemap for your website pages!" },

  // AI Writing
  { keywords: ["ai write", "ai email", "email writer"], tool: "ai-email-writer", name: "AI Email Writer", response: "Generate professional emails for job applications, leave requests and more!" },
  { keywords: ["ai story", "story generator"], tool: "ai-story-generator", name: "AI Story Generator", response: "Generate short stories in Adventure, Romance, Mystery and more genres!" },
  { keywords: ["ai essay", "essay writer", "write essay"], tool: "ai-essay-writer", name: "AI Essay Writer", response: "Generate structured essays in multiple styles for school and college!" },
  { keywords: ["wedding invitation", "shaadi card"], tool: "ai-wedding-invitation", name: "AI Wedding Invitation", response: "Generate beautiful wedding invitations in Hindu, Muslim, Sikh and Christian styles!" },
  { keywords: ["cover letter", "job application letter"], tool: "ai-cover-letter-generator", name: "AI Cover Letter Generator", response: "Generate professional cover letters tailored to your job and skills!" },

  // Education
  { keywords: ["gpa", "sgpa", "cgpa calculator"], tool: "gpa-calculator", name: "GPA Calculator", response: "Calculate your SGPA/CGPA with our GPA Calculator!" },
  { keywords: ["cgpa to percentage", "convert cgpa"], tool: "cgpa-to-percentage", name: "CGPA to Percentage", response: "Convert CGPA to percentage using CBSE, VTU and other formulas!" },

  // CAGR
  { keywords: ["cagr", "compound annual growth"], tool: "cagr-calculator", name: "CAGR Calculator", response: "Calculate Compound Annual Growth Rate for your investments!" },

  // Inflation
  { keywords: ["inflation", "purchasing power", "future value"], tool: "inflation-calculator", name: "Inflation Calculator", response: "See how inflation affects your money's purchasing power over time!" },

  // Rent Receipt
  { keywords: ["rent receipt", "hra claim"], tool: "rent-receipt-generator", name: "Rent Receipt Generator", response: "Generate rent receipts for HRA tax exemption claims!" },

  // Pomodoro
  { keywords: ["pomodoro", "focus timer", "productivity timer"], tool: "pomodoro-timer", name: "Pomodoro Timer", response: "Boost your productivity with 25/5 minute focused work sessions!" },

  // Aadhaar / PAN
  { keywords: ["aadhaar", "aadhar", "uid"], tool: "aadhaar-validator", name: "Aadhaar Validator", response: "Validate your Aadhaar number format using the Verhoeff checksum algorithm!" },
  { keywords: ["pan card", "pan number", "pan valid"], tool: "pan-card-validator", name: "PAN Card Validator", response: "Validate your PAN card number format and identify holder type!" },

  // Tip
  { keywords: ["tip calculator", "bill split", "split bill"], tool: "split-bill-calculator", name: "Split Bill Calculator", response: "Split bills and calculate tips easily with our Split Bill Calculator!" },

  // Discount
  { keywords: ["discount", "sale price", "offer price"], tool: "discount-calculator", name: "Discount Calculator", response: "Calculate discount amount and final price after discount!" },

  // Sukanya
  { keywords: ["sukanya", "ssy", "girl child saving"], tool: "sukanya-samriddhi-calculator", name: "Sukanya Samriddhi Calculator", response: "Calculate Sukanya Samriddhi Yojana maturity amount for your girl child!" },

  // EPF
  { keywords: ["epf", "employee provident", "pf calculator"], tool: "epf-calculator", name: "EPF Calculator", response: "Calculate your Employee Provident Fund maturity amount and interest!" },

  // TDS
  { keywords: ["tds", "tax deducted"], tool: "tds-calculator", name: "TDS Calculator", response: "Calculate Tax Deducted at Source for salary, rent, interest and more!" },

  // ROI
  { keywords: ["roi", "return on investment"], tool: "roi-calculator", name: "ROI Calculator", response: "Calculate your Return on Investment with our ROI Calculator!" },

  // Regex
  { keywords: ["regex", "regular expression"], tool: "regex-tester", name: "Regex Tester", response: "Test and debug your regular expressions with real-time matching!" },

  // Base64
  { keywords: ["base64", "encode decode"], tool: "base64-encoder-decoder", name: "Base64 Encoder/Decoder", response: "Encode text to Base64 or decode Base64 to text easily!" },

  // Meme
  { keywords: ["meme", "meme generator", "meme maker"], tool: "meme-generator", name: "Meme Generator", response: "Create hilarious memes with custom text on uploaded images!" },

  // Text to Speech
  { keywords: ["text to speech", "tts", "read aloud"], tool: "text-to-speech", name: "Text to Speech", response: "Convert any text to speech with voice and speed controls!" },
  { keywords: ["speech to text", "voice to text", "dictation"], tool: "speech-to-text", name: "Speech to Text", response: "Convert speech to text using voice recognition with live transcription!" },

  // Number to Words
  { keywords: ["number to words", "cheque amount", "lakhs crores"], tool: "number-to-words", name: "Number to Words", response: "Convert numbers to words in Indian numbering system (Lakhs, Crores)!" },
];

const INITIAL_MESSAGE: Message = {
  type: "bot",
  text: "Hi! I'm SabTools Assistant. Ask me anything like 'how to calculate EMI' or 'I need a PDF tool' and I'll find the right tool for you!",
};

function findMatch(input: string): { response: string; tool: string; name: string } | null {
  const lower = input.toLowerCase();
  for (const pattern of patterns) {
    for (const keyword of pattern.keywords) {
      if (lower.includes(keyword)) {
        return { response: pattern.response, tool: pattern.tool, name: pattern.name };
      }
    }
  }
  return null;
}

export default function AskSabTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { type: "user", text: trimmed };
    const match = findMatch(trimmed);

    let botMsg: Message;
    if (match) {
      botMsg = {
        type: "bot",
        text: match.response,
        toolSlug: match.tool,
        toolName: match.name,
      };
    } else {
      botMsg = {
        type: "bot",
        text: "I couldn't find a specific tool for that. Try browsing our 400+ tools at sabtools.in or search on the homepage!",
      };
    }

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-6 bottom-6 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-5 rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
          aria-label="Ask SabTools"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span className="hidden sm:inline">Ask SabTools</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed left-0 bottom-0 sm:left-6 sm:bottom-6 z-50 w-full sm:w-[350px] h-[60vh] sm:h-[450px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="font-semibold text-sm">Ask SabTools</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "bg-indigo-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.toolSlug && (
                    <Link
                      href={`/tools/${msg.toolSlug}`}
                      className={`inline-flex items-center gap-1 mt-2 font-semibold text-sm ${
                        msg.type === "user" ? "text-indigo-200" : "text-indigo-600 hover:text-indigo-800"
                      }`}
                    >
                      {msg.toolName} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any tool..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation style */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.25s ease-out;
        }
      `}</style>
    </>
  );
}
