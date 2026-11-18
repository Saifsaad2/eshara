// =========================================================================
// مشروع: إيدك بتتكلم - المساعد الذكي "إشارة"
// Google Apps Script Backend for Gemini API
// =========================================================================

// اسم النموذج - غيّر هنا فقط إذا احتجت لتحديث النموذج
// gemini-3.8-flash مع thinkingBudget:0 = وضع سريع بدون تفكير طويل (2-4 ثوانٍ)
var MODEL_NAME = 'gemini-3.8-flash';

// التعليمات الموجهة للنموذج (System Instruction)
var SYSTEM_INSTRUCTION = 
  "أنت 'إشارة' (Eshara)، مساعد ذكي ودود وبسيط لمشروع طلابي يهدف إلى مساعدة الناس العاديين على تعلّم أساسيات لغة الإشارة والتواصل بسهولة وراحة مع الأشخاص الصم وضعاف السمع.\n\n" +
  "إرشادات أسلوبك وإجاباتك:\n" +
  "1. الأسلوب: دافئ، مشجع وبسيط، بلهجة مصرية مهذبة ومحبوبة ومفهومة لكل متحدثي العربية (مزيج راقٍ من الفصحى المبسطة والروح المصرية الودودة).\n" +
  "2. الطول: إجاباتك قصيرة وواضحة ومباشرة دائماً (بين 2 إلى 5 جمل كحد أقصى) لتناسب محادثة الشات.\n" +
  "3. نطاق اختصاصك: لغة الإشارة، ثقافة الصم، نصائح عملية للتواصل الفعال، مصادر تعلّم لغة الإشارة، دمج الصم في المدارس والمجتمع، والتوعية العامة.\n" +
  "4. الأمانة العلمية: كن أميناً وصادقاً دائماً. لا تخترع أي إشارات ولا تصف حركات يدين لست متأكداً منها تماماً. وضّح دائماً أن لغات الإشارة تختلف من بلد لآخر (مثل الإشارة المصرية والأمريكية)، وأن أفضل طريقة لإتقان حركة الإشارة هي مشاهدة الفيديوهات التعليمية الموثوقة أو التعلّم المباشر من معلم أو شخص أصم.\n" +
  "5. السلامة الطبية: يُمنع منعاً باتاً تقديم أي تشخيصات طبية أو نصائح علاجية أو دوائية، وانصح بمراجعة الطبيب المختص عند الضرورة.\n" +
  "6. الخروج عن الموضوع: إذا سألك المستخدم سؤالاً خارج نطاق لغة الإشارة والتواصل مع الصم (مثل الطقس، السياسة، الرياضة، الطبخ، إلخ)، اعتذر بلباقة موضّحاً أنك مخصص فقط لمساعدة الناس في لغة الإشارة، واقترح عليه سؤالين كمثال يمكنه سؤالهما لك.\n\n" +
  "قاعدة المعرفة الموثوقة للمشروع (qa.json):\n" +
  "- ما هي لغة الإشارة: لغة بصرية تعتمد على حركات اليدين والأصابع وتعبيرات الوجه وحركة الجسم للتواصل ونقل المعلومات.\n" +
  "- لماذا نتعلمها: لأنها تساعدنا على التواصل مع الأشخاص الصم وضعاف السمع، وتساهم في نشر الوعي والدمج بين جميع أفراد المجتمع.\n" +
  "- هل هي عالمية موحدة: لا، تختلف من دولة لأخرى (مصرية، أمريكية، بريطانية، وغيرها).\n" +
  "- من هم الصم وضعاف السمع: أشخاص لديهم فقدان كلي أو جزئي في السمع، ويستخدمون لغة الإشارة كوسيلة أساسية للتواصل.\n" +
  "- هل يستطيع السامع تعلمها: بالتأكيد من خلال التدريب والممارسة المستمرة.\n" +
  "- أول شيء يجب تعلمه: البدء بالأبجدية (أبجدية الأصابع)، ثم الأرقام والكلمات والجمل البسيطة اليومية.\n" +
  "- التحية بلغة الإشارة: توجد إشارات تحية تختلف حسب البلد ويمكن تعلمها عبر فيديو تعليمي.\n" +
  "- التعريف بالنفس: استخدام الإشارات لتوضيح الاسم، أو تهجئة حروف الاسم بأبجدية الأصابع.\n" +
  "- تعبيرات الوجه: مهمة جداً لأنها توضح المعنى والمشاعر وتؤثر في معنى الجملة.\n" +
  "- حركة اليدين فقط: لا، تعتمد أيضاً على تعبيرات الوجه وحركة الجسم واتجاه اليدين ومكان الحركة.\n" +
  "- بدء محادثة مع أصم: ابدأ بالتحية، حافظ على التواصل البصري، واستخدم إشارات بسيطة أو الكتابة.\n" +
  "- إذا لم تفهم الإشارة: اطلب بهدوء تكرار الإشارة أو استخدم الكتابة لتسهيل التواصل.\n" +
  "- في المدارس والجامعات: نعم، لخلق بيئة تعليمية أكثر شمولاً ودمجاً.\n" +
  "- نشر الثقافة: تقليل الحواجز بين الصم والسامعين وزيادة فرص المشاركة المجتمعية.\n" +
  "- تطوير المستوى: مشاهدة الفيديوهات التعليمية، التدرب يومياً، وتعلم كلمات جديدة والممارسة.";

// الدالة المسؤولة عن استقبال الطلبات عبر POST مع نظام التبديل الذكي بين النماذج
function doPost(e) {
  try {
    var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!apiKey) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "لم يتم العثور على مفتاح GEMINI_API_KEY في إعدادات Script Properties."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var requestData = {};
    if (e && e.postData && e.postData.contents) {
      requestData = JSON.parse(e.postData.contents);
    }
    var rawMessages = requestData.messages || [];

    var contents = [];
    for (var i = 0; i < rawMessages.length; i++) {
      var item = rawMessages[i];
      var role = (item.role === 'model' || item.role === 'bot') ? 'model' : 'user';
      var text = item.text || item.content || '';
      if (!text || !text.trim()) continue;

      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += "\n" + text.trim();
      } else {
        contents.push({
          role: role,
          parts: [{ text: text.trim() }]
        });
      }
    }

    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

    if (contents.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        error: "لا توجد رسائل مدخلة."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // استخدام النموذج الأساسي فقط - النماذج القديمة تم إيقافها
    var botReply = "";
    var lastError = "";

    var apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' +
                 encodeURIComponent(MODEL_NAME) + ':generateContent?key=' + encodeURIComponent(apiKey);

    // thinkingBudget:0 = وضع سريع بدون تفكير طويل، يرد في 2-4 ثوانٍ فقط
    var payload = {
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
        thinkingConfig: { thinkingBudget: 0 }
      }
    };

    var options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    try {
      var response = UrlFetchApp.fetch(apiUrl, options);
      var responseCode = response.getResponseCode();
      var responseBody = response.getContentText();
      var jsonResponse = JSON.parse(responseBody);

      if (responseCode === 200) {
        if (jsonResponse.candidates && jsonResponse.candidates.length > 0 &&
            jsonResponse.candidates[0].content && jsonResponse.candidates[0].content.parts) {
          // نبحث عن أول جزء يحتوي نصاً وليس "تفكيراً داخلياً" (thought)
          var parts = jsonResponse.candidates[0].content.parts;
          for (var p = 0; p < parts.length; p++) {
            if (!parts[p].thought && parts[p].text && parts[p].text.trim()) {
              botReply = parts[p].text.trim();
              break;
            }
          }
          // لو ما لقيناش غير thought parts، نأخذ أي نص موجود
          if (!botReply && parts.length > 0 && parts[parts.length - 1].text) {
            botReply = parts[parts.length - 1].text.trim();
          }
        }
      } else {
        lastError = (jsonResponse && jsonResponse.error && jsonResponse.error.message) ?
                    jsonResponse.error.message : responseBody;
      }
    } catch (callErr) {
      lastError = callErr.toString();
    }

    if (botReply && botReply.trim()) {
      return ContentService.createTextOutput(JSON.stringify({
        reply: botReply.trim()
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // إذا فشل الاتصال بالنموذج، نرجع رسالة ودية بدل رسالة خطأ
    // (يمكن الاطلاع على تفاصيل الخطأ في View > Executions بجوال Apps Script)
    Logger.log("lastError: " + lastError);
    return ContentService.createTextOutput(JSON.stringify({
      reply: "أنا إشارة 🤟 الطلب وصلني لكن السيرفر مشغول شوية دلوقتي. جرّب تاني بعد ثانية، أو اختار سؤال من الأسئلة المقترحة!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      error: "Exception: " + err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// دالة اختبار سريعة عند فتح الرابط في المتصفح عبر GET
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    bot: "إشارة",
    message: "خادم الذكاء الاصطناعي لموقع 'إيدك بتتكلم' يعمل بنجاح! جاهز لاستقبال رسائل POST."
  })).setMimeType(ContentService.MimeType.JSON);
}
