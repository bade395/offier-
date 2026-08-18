document.addEventListener('DOMContentLoaded', () => {

    const defaultItems = [
        { carType: 'HYUNDAI GRAND i10', quantity: '', duration: '', typeOfRent: 'Yearly / سنوي', rentalPrice: '', extraKmPrice: '', isCustom: false }
    ];

    const CAR_OPTIONS = [
        "HYUNDAI GRAND i10", "SUZUKI DZIRE", "HYUNDAI ACCENT", "TOYOTA YARIS", "NISSAN SUNNY", "KIA PEGAS", "HYUNDAI ELANTRA",
        "TOYOTA COROLLA", "KIA CERATO", "TOYOTA CAMRY", "HYUNDAI SONATA", "MAZDA 6", "KIA K5", "HYUNDAI TUCSON 4X2",
        "HYUNDAI KONA 4X2", "HYUNDAI CRETA 4X2", "GEELY COOLRAY GS BASIC 4X2", "TOYOTA RAIZE 4X2", "HYUNDAI TUCSON 4X4",
        "FORD TAURUS", "KIA CARNIVAL", "HYUNDAI STARIA STANDARD 9 SEATER", "HYUNDAI STARIA 7 SEATER LUXURY", "CHEVROLET SUBURBAN 4X2",
        "TOYOTA FORTUNER GX2 4X4 (4CYL)", "NISSAN X-TRAIL", "GEELY TUGELLA FULL OPTION", "TOYOTA PRADO TX (4 CYL)", "FORD EXPLORER",
        "CHEVROLET TAHOE 4X4", "FORD BRONCO", "TOYOTA PRADO 6 CYL", "TOYOTA LANDCRUISER GXR", "NISSAN PATROL 6CYL",
        "RANGE ROVER EVOQUE R- DDYNAMIC S", "AUDI Q5", "MERCEDES GLC C200", "BMW X4", "AUDI Q8", "MERCEDES A CLASS", "BMX X2",
        "MERCEDES C CLASS", "GENESIS G80", "MERCEDES CLA 200", "AUDI Q3", "MERCEDES E CLASS", "BMW 5 SERIES", "MERCEDES VIANO",
        "BMW 730", "AUDI A8", "MERCEDES S450", "ISUZU DMAX DOUBLE CAB 4X2 MANUAL 4 CYLINDER", "ISUZU DMAX DOUBLE CAB 4X4 MANUAL 4 CYLINDER",
        "ISUZU LS DOUBLE CAB 4X2 MANUAL 6 CYLINDER", "ISUZU LS DOUBLE CAB 4X4 MANUAL 6 CYLINDER", "ISUZU LS DOUBLE CAB 4X4 AUTOMATIC 6 CYLINDER",
        "TOYOTA HIACE PETROL ( MEDIUM )", "NISSAN URVAN PETROL ( MEDIUM )", "TOYOTA HIACE DIESEL ( MEDIUM )", "NISSAN URVAN DIESEL ( MEDIUM )",
        "TOYOTA HIACE PETROL ( REFER )", "NISSAN URVAN PETROL ( REFER )", "TOYOTA HIACE DIESEL ( REFER )", "NISSAN URVAN DIESEL ( REFER )",
        "Kia Pegas", "Suzuki Dzire or Similar", "Hyundai Accent, or Similar", "Hyundai Creta", "Toyota Corolla", "Changan CS35, or Similar",
        "Mazda 6", "Hyundai Sonata", "Toyota Camry or similar", "Ford Taurus, or Similar", "BMW 3 Series or Similar", "Jetour X70 2WD",
        "Haval H6", "Hyundai Tucson 4WD", "Toyota RAV4 4WD", "Kia Sportage 4WD, or Similar", "Toyota Fortuner 4WD", "Isuzu MUX 4WD",
        "Toyota Highlander AWD HEV, or Similar", "Toyota Prado, or Similar", "CHEVROLET Tahoe", "GMC Yukon", "Nissan Patrol V6",
        "Ford Bronco, or Similar", "Yukon XL ", "CHEVROLET Suburban", "Toyota Land Cruiser, or Similar", "Lexus LX600, or Similar",
        "BMW X1", "BMW X2", "BMW 420i or Similar", "BMW 5-series or similar", "BMW 7-series or similar", "Mercedes-Benz S-class or similar",
        "Hyundai Staria minivan, or Similar", "Mercedes-Benz Vetto ", "Hyundai Staria VIP, or Similar", "Toyota Hilux (Single Cabin)",
        "Isuzu D-Max (Single Cabin)", "Toyota Hilux (Double Cabin)", "Isuzu D-Max (Double Cabin)", "Changan Hunter 4WD (Double Cabin)",
        "Hilux Super GLX", "Ford-F150", "CHEVROLET Silverado 1502"
    ];

    let items = JSON.parse(JSON.stringify(defaultItems));

    const itemsTbody = document.getElementById('items-tbody');
    const itemsTbody2 = document.getElementById('items-tbody-2');
    const overflowPage = document.getElementById('page-overflow-items');
    
    const tableSection1 = document.getElementById('table-section-1');
    const tableSection2 = document.getElementById('table-section-2');
    const summaryAndStampBlock = document.getElementById('quote-summary-and-stamp');

    const sumNetElem = document.getElementById('sum-net');
    const sumVatElem = document.getElementById('sum-vat');
    const sumGrandElem = document.getElementById('sum-grand');
    const quoteDateInput = document.getElementById('quote-date');
    const quoteRefInput = document.getElementById('quote-ref');

    const btnAddItem = document.getElementById('btn-add-item');
    const btnGenRef = document.getElementById('btn-gen-ref');
    const btnReset = document.getElementById('btn-reset');
    const btnPrint = document.getElementById('btn-print');
    const btnExportPdfMobile = document.getElementById('btn-export-pdf-mobile');
    const btnExportPdfDesktop = document.getElementById('btn-export-pdf-desktop');

    const MAX_PAGE1_CAPACITY = 20;

    function formatMoney(amount, decimals = 2) {
        if (isNaN(amount) || amount === 0) return '0.00';
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: 2
        });
    }

    function parseNum(str, isDecimal = false) {
        if (!str) return 0;
        const clean = String(str).replace(/[^\d.]/g, '');
        const n = isDecimal ? parseFloat(clean) : parseInt(clean);
        return isNaN(n) ? 0 : n;
    }

    function generateAutoMeta() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const dateStr = `${year}/${month}/${day} م`;
        const yy = String(year).slice(-2);
        const refSeq = Math.floor(100 + Math.random() * 900);
        const refStr = `${day}${month}${yy} PE${refSeq}`;
        quoteDateInput.value = dateStr;
        quoteRefInput.value = refStr;
    }

    function updateTotals() {
        let totalNet = 0, totalVat = 0, totalGrand = 0;
        const page1Count = Math.min(items.length, MAX_PAGE1_CAPACITY);

        items.forEach((item, index) => {
            const qty = parseNum(item.quantity, false);
            const dur = parseNum(item.duration, false);
            const price = parseNum(item.rentalPrice, true);
            
            const lineTotal = qty * dur * price;
            const lineVat = lineTotal * 0.15;
            const lineGrand = lineTotal + lineVat;

            totalNet += lineTotal;
            totalVat += lineVat;
            totalGrand += lineGrand;

            let row = itemsTbody.rows[index];
            if (!row && itemsTbody2) {
                row = itemsTbody2.rows[index - page1Count];
            }

            if (row) {
                row.cells[5].innerHTML = lineTotal > 0 ? formatMoney(lineTotal, 2) : '0.00';
                row.cells[6].innerHTML = lineVat > 0 ? formatMoney(lineVat, 2) : '0.00';
                row.cells[7].innerHTML = lineGrand > 0 ? formatMoney(lineGrand, 2) : '0.00';
            }
        });

        sumNetElem.textContent = formatMoney(totalNet, 2);
        sumVatElem.textContent = formatMoney(totalVat, 2);
        sumGrandElem.textContent = formatMoney(totalGrand, 2);
    }

    function buildRowHtml(item, index) {
        const qty = parseNum(item.quantity, false);
        const dur = parseNum(item.duration, false);
        const price = parseNum(item.rentalPrice, true);
        const lineTotal = qty * dur * price;
        const lineVat = lineTotal * 0.15;
        const lineGrand = lineTotal + lineVat;

        let carFieldHtml = '';
        if (item.isCustom) {
            carFieldHtml = `
                <div class="custom-car-input-group">
                    <input type="text" class="editable-field table-input car-type-input" value="${item.carType}" data-index="${index}" data-key="carType" placeholder="أدخل اسم السيارة">
                    <button type="button" class="btn-toggle-select no-print" data-index="${index}" title="العودة للقائمة المنسدلة">↺</button>
                </div>
            `;
        } else {
            const optionsHtml = CAR_OPTIONS.map(car => `<option value="${car}" ${item.carType === car ? 'selected' : ''}>${car}</option>`).join('');
            carFieldHtml = `
                <select class="table-select car-type-select" data-index="${index}" data-key="carType">
                    ${optionsHtml}
                    <option value="__custom__">✏️ كتابة اسم سيارة جديد (يدوي)...</option>
                </select>
            `;
        }

        return `
            <td>${carFieldHtml}</td>
            <td>
                <input type="text" inputmode="numeric" class="editable-field table-input" value="${item.quantity}" data-index="${index}" data-key="quantity" placeholder="0">
            </td>
            <td>
                <input type="text" inputmode="numeric" class="editable-field table-input" value="${item.duration}" data-index="${index}" data-key="duration" placeholder="0">
            </td>
            <td>
                <select class="table-select" data-index="${index}" data-key="typeOfRent">
                    <option value="Yearly / سنوي" ${item.typeOfRent === 'Yearly / سنوي' ? 'selected' : ''}>Yearly / سنوي</option>
                    <option value="Monthly / شهري" ${item.typeOfRent === 'Monthly / شهري' ? 'selected' : ''}>Monthly / شهري</option>
                    <option value="Daily / يومي" ${item.typeOfRent === 'Daily / يومي' ? 'selected' : ''}>Daily / يومي</option>
                </select>
            </td>
            <td>
                <input type="text" inputmode="decimal" class="editable-field table-input price-input" value="${item.rentalPrice}" data-index="${index}" data-key="rentalPrice" placeholder="0.00">
            </td>
            <td class="total-cell">${lineTotal > 0 ? formatMoney(lineTotal, 2) : '0.00'}</td>
            <td class="total-cell">${lineVat > 0 ? formatMoney(lineVat, 2) : '0.00'}</td>
            <td class="total-cell">${lineGrand > 0 ? formatMoney(lineGrand, 2) : '0.00'}</td>
            <td>
                <input type="text" inputmode="decimal" class="editable-field table-input" value="${item.extraKmPrice || ''}" data-index="${index}" data-key="extraKmPrice" placeholder="0.00">
            </td>
            <td class="no-print row-action-col">
                ${items.length > 1 ? `<button type="button" class="btn-del-row" data-index="${index}">×</button>` : ''}
            </td>
        `;
    }

    function renderItems() {
        itemsTbody.innerHTML = '';
        if (itemsTbody2) itemsTbody2.innerHTML = '';

        const page1Cutoff = Math.min(items.length, MAX_PAGE1_CAPACITY);
        const page1Items = items.slice(0, page1Cutoff);
        const page2Items = items.slice(page1Cutoff);

        page1Items.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-row', idx);
            tr.innerHTML = buildRowHtml(item, idx);
            itemsTbody.appendChild(tr);
        });

        if (page2Items.length > 0) {
            overflowPage.style.display = 'block';
            page2Items.forEach((item, idx) => {
                const actualIdx = page1Cutoff + idx;
                const tr = document.createElement('tr');
                tr.setAttribute('data-row', actualIdx);
                tr.innerHTML = buildRowHtml(item, actualIdx);
                itemsTbody2.appendChild(tr);
            });
            tableSection2.after(summaryAndStampBlock);
        } else {
            overflowPage.style.display = 'none';
            tableSection1.after(summaryAndStampBlock);
        }

        updateTotals();
        attachInputListeners();
    }

    function attachInputListeners() {
        document.querySelectorAll('[data-index]').forEach(el => {
            const isSelect = el.tagName === 'SELECT';
            el.addEventListener(isSelect ? 'change' : 'input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const key = e.target.getAttribute('data-key');
                const rawVal = e.target.value;

                if (key === 'carType' && rawVal === '__custom__') {
                    items[idx].isCustom = true;
                    items[idx].carType = '';
                    renderItems();
                    return;
                }

                items[idx][key] = rawVal;
                updateTotals();
            });
        });

        document.querySelectorAll('.btn-toggle-select').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                items[idx].isCustom = false;
                items[idx].carType = CAR_OPTIONS[0];
                renderItems();
            });
        });

        document.querySelectorAll('.btn-del-row').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                items.splice(idx, 1);
                renderItems();
            });
        });
    }

    btnAddItem.addEventListener('click', () => {
        markQuoteDirty();
        items.push({
            carType: CAR_OPTIONS[0],
            quantity: '',
            duration: '',
            typeOfRent: 'Yearly / سنوي',
            rentalPrice: '',
            extraKmPrice: '',
            isCustom: false
        });
        renderItems();
    });

    btnGenRef.addEventListener('click', () => {
        generateAutoMeta();
        markQuoteDirty();
    });

    btnReset.addEventListener('click', () => {
        if (confirm('هل أنت تأكد من إعادة ضبط البيانات إلى الحالة الأصلية؟')) {
            markQuoteDirty();
            currentEditingQuoteId = null;
            lastSavedQuoteId = null;
            if (btnSaveQuote) btnSaveQuote.hidden = true;
            items = JSON.parse(JSON.stringify(defaultItems));
            document.getElementById('client-name').value = '';
            const termsAr = document.getElementById('terms-ar');
            const termsEn = document.getElementById('terms-en');
            if (termsAr) termsAr.value = '';
            if (termsEn) termsEn.value = '';
            generateAutoMeta();
            renderItems();
        }
    });

    btnPrint.addEventListener('click', async () => {
        btnPrint.disabled = true;
        try {
            const quoteId = await ensureSavedBeforeOutput('desktop');
            if (!quoteId) return;
            // النسخة المخزنة هي نفس قالب PDF A4 الذي تستخدمه المنظومة.\n            window.print();
        } catch (error) {
            console.error('Print save error:', error);
            alert(`تعذر حفظ نسخة PDF قبل الطباعة.\n${error.message || error}`);
        } finally {
            btnPrint.disabled = false;
        }
    });

    // ============================================================
    // Supabase + Device tracking + Manager-only administration
    // ============================================================
    const SUPABASE_URL = "https://hlxthevwrberbrsujeqj.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_lpCw-zOKEyHYzmXr8UEOIg_3UlbLSNN";

    const SUPABASE_READY =
        typeof window.supabase !== 'undefined' &&
        SUPABASE_URL.includes('.supabase.co') &&
        !SUPABASE_URL.includes('YOUR-PROJECT') &&
        SUPABASE_ANON_KEY &&
        !SUPABASE_ANON_KEY.includes('YOUR_PUBLISHABLE');

    const supabaseClient = SUPABASE_READY
        ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        : null;

    const DEVICE_ID_KEY = 'nisr_quote_device_id_v1';
    const DEVICE_NAME_KEY = 'nisr_quote_device_name_v1';
    let currentDeviceId = localStorage.getItem(DEVICE_ID_KEY);
    let currentDeviceName = localStorage.getItem(DEVICE_NAME_KEY);
    let isManager = false;
    let managerUser = null;
    let currentEditingQuoteId = null;
    let quoteDirty = true;
    let suppressDirty = false;
    let lastSavedFingerprint = null;
    let lastSavedQuoteId = null;

    function createDeviceId() {
        const uuid = (window.crypto && crypto.randomUUID)
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        return `DEV-${uuid.replace(/-/g, '').slice(0, 12).toUpperCase()}`;
    }

    function getDeviceInfo() {
        return {
            platform: navigator.platform || '',
            language: navigator.language || '',
            userAgent: navigator.userAgent || '',
            screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`
        };
    }

    function ensureDeviceIdentity() {
        if (!currentDeviceId) {
            currentDeviceId = createDeviceId();
            localStorage.setItem(DEVICE_ID_KEY, currentDeviceId);
        }
        if (!currentDeviceName) {
            const suggested = `${navigator.platform || 'جهاز'} - ${window.innerWidth <= 768 ? 'جوال' : 'كمبيوتر'}`;
            const entered = prompt(
                `أدخل اسم هذا الجهاز ليظهر مع عروض الأسعار المحفوظة.\nمثال: مكتب المبيعات - أحمد`,
                suggested
            );
            currentDeviceName = (entered || suggested || 'جهاز غير مسمى').trim();
            localStorage.setItem(DEVICE_NAME_KEY, currentDeviceName);
        }
        return { deviceId: currentDeviceId, deviceName: currentDeviceName };
    }

    const deviceIdentity = ensureDeviceIdentity();

    const btnSaveQuote = document.getElementById('btn-save-quote');
    const btnHistory = document.getElementById('btn-history');
    const btnManagerLogin = document.getElementById('btn-manager-login');
    const historyModal = document.getElementById('quote-history-modal');
    const btnCloseHistory = document.getElementById('btn-close-history');
    const btnHistoryRefresh = document.getElementById('btn-history-refresh');
    const historySearch = document.getElementById('quote-history-search');
    const historyTbody = document.getElementById('quote-history-tbody');
    const historyStatus = document.getElementById('quote-history-status');
    const deviceSummary = document.getElementById('device-summary');

    const managerLoginModal = document.getElementById('manager-login-modal');
    const managerLoginForm = document.getElementById('manager-login-form');
    const managerEmail = document.getElementById('manager-email');
    const managerPassword = document.getElementById('manager-password');
    const managerLoginStatus = document.getElementById('manager-login-status');
    const btnCloseManagerLogin = document.getElementById('btn-close-manager-login');

    function databaseReadyMessage() {
        return 'قاعدة البيانات غير مفعلة بعد. افتح script.js وضع SUPABASE_URL و SUPABASE_ANON_KEY الخاصين بمشروعك ثم أعد تحميل الموقع.';
    }

    function markQuoteDirty() {
        if (suppressDirty) return;
        quoteDirty = true;
    }

    function getClientName() {
        return (document.getElementById('client-name')?.value || '').trim();
    }

    function getTermsAr() { return document.getElementById('terms-ar')?.value || ''; }
    function getTermsEn() { return document.getElementById('terms-en')?.value || ''; }

    function calculateQuoteTotals() {
        return items.reduce((totals, item) => {
            const qty = parseNum(item.quantity, false);
            const dur = parseNum(item.duration, false);
            const price = parseNum(item.rentalPrice, true);
            const net = qty * dur * price;
            const vat = net * 0.15;
            totals.net += net;
            totals.vat += vat;
            totals.grand += net + vat;
            return totals;
        }, { net: 0, vat: 0, grand: 0 });
    }

    function buildQuotePayload() {
        const totals = calculateQuoteTotals();
        return {
            quote_ref: (quoteRefInput.value || '').trim(),
            quote_date: (quoteDateInput.value || '').trim(),
            client_name: getClientName(),
            items: JSON.parse(JSON.stringify(items)),
            total_net: Number(totals.net.toFixed(2)),
            total_vat: Number(totals.vat.toFixed(2)),
            total_grand: Number(totals.grand.toFixed(2)),
            terms_ar: getTermsAr(),
            terms_en: getTermsEn(),
            device_id: deviceIdentity.deviceId,
            device_name: deviceIdentity.deviceName,
            device_info: getDeviceInfo()
        };
    }

    function fingerprintQuote(payload) {
        return JSON.stringify({
            quote_ref: payload.quote_ref,
            quote_date: payload.quote_date,
            client_name: payload.client_name,
            items: payload.items,
            total_net: payload.total_net,
            total_vat: payload.total_vat,
            total_grand: payload.total_grand,
            terms_ar: payload.terms_ar,
            terms_en: payload.terms_en
        });
    }

    function setSaveButtonState(loading) {
        if (!btnSaveQuote) return;
        btnSaveQuote.disabled = loading;
        btnSaveQuote.dataset.originalText ||= btnSaveQuote.innerHTML;
        btnSaveQuote.innerHTML = loading ? '⏳ جاري الحفظ...' : btnSaveQuote.dataset.originalText;
    }

    async function insertNewQuote({ silent = false, pdfMode = null } = {}) {
        if (!supabaseClient) {
            if (!silent) alert(databaseReadyMessage());
            return null;
        }

        const quoteRef = (quoteRefInput.value || '').trim();
        const clientName = getClientName();
        if (!quoteRef) {
            if (!silent) { alert('يرجى إدخال رقم عرض السعر أولاً.'); quoteRefInput.focus(); }
            return null;
        }
        if (!clientName) {
            if (!silent) { alert('يرجى إدخال اسم العميل أولاً.'); document.getElementById('client-name')?.focus(); }
            return null;
        }

        const payload = buildQuotePayload();
        const fingerprint = fingerprintQuote(payload);
        if (!quoteDirty && lastSavedFingerprint === fingerprint && lastSavedQuoteId) return { id: lastSavedQuoteId, quote_ref: quoteRef };

        setSaveButtonState(true);
        let generatedPdf = null;
        let pdfPath = null;
        let quoteId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        try {
            // نجهز ملف PDF أولًا ونرفعه باسم UUID للعرض، ثم ننشئ سجل العرض مع مسار الملف.
            // بهذا لا يحتاج المستخدم العادي إلى UPDATE على جدول quotes.
            if (pdfMode) {
                generatedPdf = await buildPdfBlob(pdfMode);
                const safeRef = String(payload.quote_ref || 'Quotation').replace(/[^\u0600-\u06FF\w\-]+/g, '_');
                pdfPath = `quotes/${quoteId}/${Date.now()}_${safeRef}.pdf`;
                const { error: uploadError } = await supabaseClient.storage
                    .from('quote-pdfs')
                    .upload(pdfPath, generatedPdf.blob, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
                if (uploadError) throw uploadError;
            }

            const insertPayload = {
                ...payload,
                id: quoteId,
                ...(pdfPath ? {
                    pdf_path: pdfPath,
                    pdf_filename: generatedPdf.filename,
                    pdf_size: generatedPdf.blob.size,
                    pdf_uploaded_at: new Date().toISOString()
                } : {})
            };

            let { error } = await supabaseClient
                .from('quotes')
                .insert(insertPayload);
            let data = { id: quoteId, quote_ref: payload.quote_ref, pdf_path: pdfPath, pdf_filename: generatedPdf?.filename || null };

            if (error && (error.code === '23505' || /duplicate|unique/i.test(error.message || ''))) {
                // نغيّر رقم العرض فقط ثم نعيد الإدراج بنفس آلية PDF.
                const firstPdfPath = pdfPath;
                if (firstPdfPath) {
                    try { await supabaseClient.storage.from('quote-pdfs').remove([firstPdfPath]); } catch (_) {}
                }
                generateAutoMeta();
                const retryPayload = buildQuotePayload();
                quoteId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
                pdfPath = null;
                generatedPdf = null;
                if (pdfMode) {
                    generatedPdf = await buildPdfBlob(pdfMode);
                    const safeRef = String(retryPayload.quote_ref || 'Quotation').replace(/[^\u0600-\u06FF\w\-]+/g, '_');
                    pdfPath = `quotes/${quoteId}/${Date.now()}_${safeRef}.pdf`;
                    const { error: retryUploadError } = await supabaseClient.storage
                        .from('quote-pdfs')
                        .upload(pdfPath, generatedPdf.blob, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
                    if (retryUploadError) throw retryUploadError;
                }
                ({ error } = await supabaseClient
                    .from('quotes')
                    .insert({
                        ...retryPayload,
                        id: quoteId,
                        ...(pdfPath ? { pdf_path: pdfPath, pdf_filename: generatedPdf.filename, pdf_size: generatedPdf.blob.size, pdf_uploaded_at: new Date().toISOString() } : {})
                    }));
                data = { id: quoteId, quote_ref: retryPayload.quote_ref, pdf_path: pdfPath, pdf_filename: generatedPdf?.filename || null };
                if (!error && !silent) alert(`✓ تم الحفظ برقم جديد ${retryPayload.quote_ref} لأن الرقم السابق مستخدم بالفعل.`);
            }

            if (error) throw error;
            lastSavedFingerprint = fingerprintQuote(buildQuotePayload());
            quoteDirty = false;
            currentEditingQuoteId = null;
            lastSavedQuoteId = data?.id || null;
            if (!silent) alert(`✓ تم حفظ عرض السعر ${data.quote_ref}${pdfPath ? ' ونسخة PDF' : ''} بنجاح.`);
            return data || null;
        } catch (error) {
            console.error('Insert quote error:', error);
            // إذا رُفع PDF لكن فشل إنشاء سجل العرض، نحاول تنظيف الملف المعلّق.
            if (pdfPath) {
                try { await supabaseClient.storage.from('quote-pdfs').remove([pdfPath]); } catch (_) {}
            }
            if (!silent) alert(`تعذر حفظ العرض وملف PDF.\n${error.message || error}`);
            return null;
        } finally {
            setSaveButtonState(false);
        }
    }

    async function updateManagerQuote() {
        if (!isManager || !currentEditingQuoteId || !supabaseClient) return null;
        const payload = buildQuotePayload();
        setSaveButtonState(true);
        try {
            const { data, error } = await supabaseClient
                .from('quotes')
                .update({ ...payload, updated_at: new Date().toISOString() })
                .eq('id', currentEditingQuoteId)
                .select('id,quote_ref,pdf_path,pdf_filename')
                .single();
            if (error) throw error;
            quoteDirty = false;
            lastSavedFingerprint = fingerprintQuote(buildQuotePayload());
            lastSavedQuoteId = data?.id || currentEditingQuoteId;
            // المدير يحفظ البيانات ونسخة PDF الجديدة معًا.
            try {
                const generated = await buildPdfBlob('desktop');
                const uploaded = await uploadQuotePdf(lastSavedQuoteId, generated.blob, generated.filename, { silent: true });
                if (!uploaded) alert('تم حفظ بيانات التعديل، لكن تعذر تحديث ملف PDF المحفوظ. يمكنك إعادة حفظ التعديل لاحقًا.');
            } catch (pdfError) {
                console.error('Manager PDF update error:', pdfError);
                alert(`تم حفظ بيانات التعديل، لكن تعذر تحديث ملف PDF.\n${pdfError.message || pdfError}`);
            }
            alert(`✓ تم تحديث عرض السعر ${data.quote_ref} بواسطة المدير.`);
            return data;
        } catch (error) {
            console.error('Manager update error:', error);
            alert(`تعذر حفظ تعديل المدير.\n${error.message || error}`);
            return null;
        } finally {
            setSaveButtonState(false);
        }
    }

    async function ensureSavedBeforeOutput(mode = 'desktop') {
        if (!supabaseClient) {
            alert(databaseReadyMessage());
            return null;
        }
        // المدير إذا كان يعدل عرضًا محفوظًا يجب أن يحفظ التعديل صراحةً قبل الطباعة/PDF.
        if (isManager && currentEditingQuoteId && quoteDirty) {
            alert('يوجد تعديل على عرض محفوظ. اضغط «حفظ تعديل المدير» أولاً ثم قم بالطباعة أو تنزيل PDF.');
            return null;
        }

        let quoteId = currentEditingQuoteId || lastSavedQuoteId;
        if (!quoteDirty && lastSavedFingerprint && quoteId) {
            return quoteId;
        }

        const saved = await insertNewQuote({ silent: false, pdfMode: mode });
        return saved?.id || null;
    }

    async function buildPdfBlob(mode = 'mobile') {
        const pages = Array.from(document.querySelectorAll('#document-to-pdf .a4-page'))
            .filter(page => getComputedStyle(page).display !== 'none');

        if (!pages.length) throw new Error('No printable pages found');
        if (typeof html2canvas !== 'function') throw new Error('html2canvas is not loaded');

        const jsPDFCtor = window.jspdf && window.jspdf.jsPDF
            ? window.jspdf.jsPDF
            : window.jsPDF;
        if (typeof jsPDFCtor !== 'function') throw new Error('jsPDF is not loaded');

        const A4_WIDTH_MM = 210;
        const A4_HEIGHT_MM = 297;
        const A4_WIDTH_PX = 794;
        const A4_HEIGHT_PX = 1123;
        const renderScale = mode === 'desktop'
            ? 2
            : Math.min(2, Math.max(1.5, window.devicePixelRatio || 1));

        const pdf = new jsPDFCtor({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            compress: true,
            putOnlyUsedFonts: true
        });

        const stage = document.createElement('div');
        stage.id = 'pdf-export-stage';
        stage.className = `pdf-export-stage-${mode}`;
        stage.setAttribute('aria-hidden', 'true');
        stage.style.cssText = [
            'position:fixed','left:-100000px','top:0',
            `width:${A4_WIDTH_PX}px`,`height:${A4_HEIGHT_PX}px`,
            'overflow:hidden','margin:0','padding:0','background:#ffffff',
            'z-index:-1','pointer-events:none'
        ].join(';');
        document.body.appendChild(stage);

        const exportStyle = document.createElement('style');
        exportStyle.textContent = `
            #pdf-export-stage, #pdf-export-stage * { box-sizing: border-box !important; }
            #pdf-export-stage .a4-page { width:210mm !important; height:297mm !important; min-width:210mm !important; max-width:210mm !important; min-height:297mm !important; max-height:297mm !important; margin:0 !important; padding:0 !important; overflow:hidden !important; position:relative !important; box-shadow:none !important; border:0 !important; page-break-after:auto !important; break-after:auto !important; transform:none !important; zoom:1 !important; background-size:100% 100% !important; background-repeat:no-repeat !important; background-position:center center !important; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
            #pdf-export-stage .no-print, #pdf-export-stage .btn-toggle-select, #pdf-export-stage .row-action-col { display:none !important; }
            #pdf-export-stage .editable-field { border:none !important; border-color:transparent !important; background:transparent !important; box-shadow:none !important; outline:none !important; padding:0 !important; }
            #pdf-export-stage .table-select, #pdf-export-stage .car-type-select { appearance:none !important; -webkit-appearance:none !important; -moz-appearance:none !important; border:none !important; background:transparent !important; box-shadow:none !important; outline:none !important; color:#000 !important; text-align:center !important; text-align-last:center !important; width:100% !important; padding:0 !important; }
            #pdf-export-stage .terms-box textarea { border:none !important; background:transparent !important; resize:none !important; outline:none !important; }
            #pdf-export-stage.pdf-export-stage-desktop .a4-page { height:296mm !important; min-height:296mm !important; max-height:296mm !important; }
            #pdf-export-stage.pdf-export-stage-desktop .table-select, #pdf-export-stage.pdf-export-stage-desktop .car-type-select { font-size:.74rem !important; font-weight:800 !important; color:#000 !important; }
            #pdf-export-stage.pdf-export-stage-desktop .terms-box textarea { background:transparent !important; }
        `;
        stage.appendChild(exportStyle);

        const waitForImages = async (root) => {
            const images = Array.from(root.querySelectorAll('img'));
            await Promise.all(images.map(img => {
                if (img.complete && img.naturalWidth > 0) return Promise.resolve();
                return new Promise(resolve => {
                    const done = () => resolve();
                    img.addEventListener('load', done, { once: true });
                    img.addEventListener('error', done, { once: true });
                    setTimeout(done, 4000);
                });
            }));
        };

        const syncFormValues = (source, clone) => {
            const sourceFields = source.querySelectorAll('input, textarea, select');
            const cloneFields = clone.querySelectorAll('input, textarea, select');
            sourceFields.forEach((field, index) => {
                const target = cloneFields[index];
                if (!target) return;
                if (field.tagName === 'TEXTAREA') {
                    target.value = field.value;
                    target.textContent = field.value;
                } else if (field.tagName === 'SELECT') {
                    Array.from(target.options).forEach(option => option.selected = option.value === field.value);
                    target.setAttribute('data-pdf-value', field.value);
                } else {
                    target.value = field.value;
                    target.setAttribute('value', field.value);
                }
            });
        };

        try {
            if (document.fonts) await document.fonts.ready;
            for (let i = 0; i < pages.length; i++) {
                const sourcePage = pages[i];
                const clone = sourcePage.cloneNode(true);
                syncFormValues(sourcePage, clone);
                stage.appendChild(clone);
                await waitForImages(clone);
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                const canvas = await html2canvas(clone, {
                    scale: renderScale, width:A4_WIDTH_PX, height:A4_HEIGHT_PX,
                    windowWidth:A4_WIDTH_PX, windowHeight:A4_HEIGHT_PX,
                    x:0, y:0, scrollX:0, scrollY:0,
                    useCORS:true, allowTaint:false, backgroundColor:'#ffffff',
                    imageTimeout:15000, logging:false, removeContainer:true
                });
                if (i > 0) pdf.addPage('a4', 'portrait');
                const imageData = canvas.toDataURL('image/png');
                pdf.addImage(imageData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
                stage.removeChild(clone);
            }
            const refVal = quoteRefInput.value || 'Quotation';
            const suffix = mode === 'desktop' ? 'كمبيوتر' : 'جوال';
            const filename = `عرض_سعر_${refVal}_${suffix}.pdf`;
            const blob = pdf.output('blob');
            return { blob, filename };
        } finally {
            stage.remove();
        }
    }

    async function uploadQuotePdf(quoteId, pdfBlob, filename, { silent = false } = {}) {
        if (!supabaseClient || !quoteId || !pdfBlob) return false;
        const safeRef = String(quoteRefInput.value || 'Quotation').replace(/[^\u0600-\u06FF\w\-]+/g, '_');
        const path = `quotes/${quoteId}/${Date.now()}_${safeRef}.pdf`;
        try {
            // نحذف الملف القديم بعد نجاح الرفع الجديد، حتى لا تضيع النسخة السابقة إذا فشل الرفع.
            let oldPath = null;
            if (isManager) {
                const { data: oldRow } = await supabaseClient.from('quotes').select('pdf_path').eq('id', quoteId).single();
                oldPath = oldRow?.pdf_path || null;
            }
            const { error: uploadError } = await supabaseClient.storage
                .from('quote-pdfs')
                .upload(path, pdfBlob, { contentType: 'application/pdf', upsert: false, cacheControl: '3600' });
            if (uploadError) throw uploadError;

            const { error: updateError } = await supabaseClient.from('quotes').update({
                pdf_path: path,
                pdf_filename: filename,
                pdf_size: pdfBlob.size,
                pdf_uploaded_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }).eq('id', quoteId);
            if (updateError) throw updateError;

            if (oldPath && oldPath !== path) {
                await supabaseClient.storage.from('quote-pdfs').remove([oldPath]);
            }
            return true;
        } catch (error) {
            console.error('PDF upload error:', error);
            if (!silent) alert(`تم حفظ بيانات العرض، لكن تعذر حفظ ملف PDF في قاعدة البيانات.\n${error.message || error}`);
            return false;
        }
    }

    async function savePdfForQuote(quoteId, mode = 'desktop') {
        if (!quoteId) return false;
        const generated = await buildPdfBlob(mode);
        return uploadQuotePdf(quoteId, generated.blob, generated.filename, { silent: false });
    }

    async function downloadSavedQuotePdf(id) {
        if (!isManager || !supabaseClient || !id) return;
        try {
            const { data: row, error } = await supabaseClient.from('quotes').select('pdf_path,pdf_filename,quote_ref').eq('id', id).single();
            if (error) throw error;
            if (!row?.pdf_path) throw new Error('ملف PDF غير موجود لهذا العرض.');
            const { data, error: signError } = await supabaseClient.storage.from('quote-pdfs').createSignedUrl(row.pdf_path, 300);
            if (signError) throw signError;
            window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            alert(`تعذر فتح ملف PDF.\n${error.message || error}`);
        }
    }


    function openHistoryModal() {
        if (!isManager) { openManagerLoginModal(); return; }
        if (!historyModal) return;
        historyModal.classList.add('is-open');
        historyModal.setAttribute('aria-hidden', 'false');
        if (deviceSummary) deviceSummary.textContent = `وضع المدير — الجهاز الحالي: ${deviceIdentity.deviceName} — ${deviceIdentity.deviceId}`;
        loadQuoteHistory();
    }

    function closeHistoryModal() {
        if (!historyModal) return;
        historyModal.classList.remove('is-open');
        historyModal.setAttribute('aria-hidden', 'true');
    }

    function openManagerLoginModal() {
        if (!managerLoginModal) return;
        managerLoginModal.classList.add('is-open');
        managerLoginModal.setAttribute('aria-hidden', 'false');
        managerLoginStatus.textContent = '';
        setTimeout(() => managerEmail?.focus(), 50);
    }

    function closeManagerLoginModal() {
        if (!managerLoginModal) return;
        managerLoginModal.classList.remove('is-open');
        managerLoginModal.setAttribute('aria-hidden', 'true');
    }

    function setManagerUI(loggedIn, user = null) {
        isManager = loggedIn;
        managerUser = user;
        if (btnHistory) btnHistory.hidden = !loggedIn;
        if (btnSaveQuote) btnSaveQuote.hidden = !loggedIn || !currentEditingQuoteId;
        if (btnManagerLogin) {
            btnManagerLogin.innerHTML = loggedIn
                ? '<span aria-hidden="true">🚪</span> خروج المدير'
                : '<span aria-hidden="true">🔐</span> دخول المدير';
            btnManagerLogin.classList.toggle('manager-logout', loggedIn);
            btnManagerLogin.title = loggedIn ? 'تسجيل خروج المدير' : 'دخول المدير';
        }
    }

    async function verifyManager(user) {
        if (!supabaseClient || !user) return false;
        const { data, error } = await supabaseClient.rpc('is_manager');
        if (error) {
            console.error('Manager verification error:', error);
            return false;
        }
        return data === true;
    }

    async function handleManagerLogin(event) {
        event.preventDefault();
        if (!supabaseClient) { managerLoginStatus.textContent = databaseReadyMessage(); return; }
        managerLoginStatus.textContent = 'جاري التحقق...';
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: managerEmail.value.trim(),
                password: managerPassword.value
            });
            if (error) throw error;
            const manager = await verifyManager(data.user);
            if (!manager) {
                await supabaseClient.auth.signOut();
                throw new Error('هذا الحساب ليس لديه صلاحية المدير.');
            }
            setManagerUI(true, data.user);
            closeManagerLoginModal();
            managerPassword.value = '';
            alert('✓ تم تسجيل دخول المدير بنجاح.');
            openHistoryModal();
        } catch (error) {
            console.error('Manager login error:', error);
            managerLoginStatus.textContent = `تعذر تسجيل الدخول: ${error.message || error}`;
        }
    }

    async function handleManagerButton() {
        if (!isManager) { openManagerLoginModal(); return; }
        if (supabaseClient) await supabaseClient.auth.signOut();
        setManagerUI(false, null);
        closeHistoryModal();
        currentEditingQuoteId = null;
        lastSavedQuoteId = null;
        if (btnSaveQuote) btnSaveQuote.hidden = true;
        alert('تم تسجيل خروج المدير.');
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    function formatHistoryDate(value) {
        if (!value) return '-';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return escapeHtml(value);
        return d.toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' });
    }

    function renderQuoteHistory(rows) {
        if (!historyTbody) return;
        if (!rows.length) {
            historyTbody.innerHTML = '<tr><td colspan="7" class="quote-history-empty">لا توجد عروض محفوظة.</td></tr>';
            return;
        }
        historyTbody.innerHTML = rows.map(row => `
            <tr>
                <td>${escapeHtml(row.quote_ref)}</td>
                <td>${escapeHtml(row.client_name)}</td>
                <td>${escapeHtml(row.quote_date)}</td>
                <td>${formatMoney(Number(row.total_grand || 0), 2)} ر.س</td>
                <td>${escapeHtml(row.device_name)}<br><small>${escapeHtml(row.device_id)}</small></td>
                <td>${formatHistoryDate(row.created_at)}</td>
                <td>
                    <div class="quote-history-action">
                        ${row.pdf_path ? `<button type="button" class="quote-history-pdf" data-pdf-quote="${escapeHtml(row.id)}">PDF</button>` : '<span class="quote-history-no-pdf">بدون PDF</span>'}
                        <button type="button" class="quote-history-edit" data-open-quote="${escapeHtml(row.id)}">فتح وتعديل</button>
                        <button type="button" class="quote-history-delete" data-delete-quote="${escapeHtml(row.id)}">حذف</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async function loadQuoteHistory() {
        if (!historyStatus) return;
        if (!isManager || !supabaseClient) {
            historyStatus.textContent = !supabaseClient ? databaseReadyMessage() : 'سجل العروض متاح للمدير فقط.';
            renderQuoteHistory([]);
            return;
        }
        historyStatus.textContent = 'جاري تحميل العروض...';
        const search = (historySearch?.value || '').trim();
        try {
            let query = supabaseClient
                .from('quotes')
                .select('id,quote_ref,quote_date,client_name,total_grand,device_id,device_name,created_at,updated_at,pdf_path,pdf_filename')
                .order('created_at', { ascending: false }).limit(500);
            if (search) {
                const safe = search.replace(/,/g, ' ');
                query = query.or(`quote_ref.ilike.%${safe}%,client_name.ilike.%${safe}%,device_name.ilike.%${safe}%,device_id.ilike.%${safe}%`);
            }
            const { data, error } = await query;
            if (error) throw error;
            renderQuoteHistory(data || []);
            historyStatus.textContent = `${(data || []).length} عرض محفوظ`;
        } catch (error) {
            console.error('History error:', error);
            historyStatus.textContent = `تعذر تحميل السجل: ${error.message || error}`;
            renderQuoteHistory([]);
        }
    }

    async function openSavedQuote(id) {
        if (!isManager || !supabaseClient || !id) return;
        try {
            const { data, error } = await supabaseClient.from('quotes').select('*').eq('id', id).single();
            if (error) throw error;
            if (!data) return;
            suppressDirty = true;
            currentEditingQuoteId = data.id;
            lastSavedQuoteId = data.id;
            items = Array.isArray(data.items) && data.items.length ? JSON.parse(JSON.stringify(data.items)) : JSON.parse(JSON.stringify(defaultItems));
            quoteRefInput.value = data.quote_ref || '';
            quoteDateInput.value = data.quote_date || '';
            const clientInput = document.getElementById('client-name');
            if (clientInput) clientInput.value = data.client_name || '';
            const ar = document.getElementById('terms-ar');
            const en = document.getElementById('terms-en');
            if (ar) ar.value = data.terms_ar || '';
            if (en) en.value = data.terms_en || '';
            renderItems();
            suppressDirty = false;
            quoteDirty = false;
            lastSavedFingerprint = fingerprintQuote(buildQuotePayload());
            if (btnSaveQuote) btnSaveQuote.hidden = false;
            closeHistoryModal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            alert(`✓ تم فتح عرض السعر ${data.quote_ref} في وضع المدير.`);
        } catch (error) {
            suppressDirty = false;
            console.error('Open quote error:', error);
            alert(`تعذر فتح العرض.\n${error.message || error}`);
        }
    }

    async function deleteSavedQuote(id) {
        if (!isManager || !supabaseClient || !id) return;
        if (!confirm('هل تريد حذف عرض السعر المحفوظ؟ لا يمكن التراجع عن هذه العملية.')) return;
        try {
            const { data: row, error: fetchError } = await supabaseClient.from('quotes').select('pdf_path').eq('id', id).single();
            if (fetchError) throw fetchError;
            if (row?.pdf_path) {
                const { error: storageError } = await supabaseClient.storage.from('quote-pdfs').remove([row.pdf_path]);
                if (storageError) console.warn('PDF storage delete warning:', storageError);
            }
            const { error } = await supabaseClient.from('quotes').delete().eq('id', id);
            if (error) throw error;
            await loadQuoteHistory();
        } catch (error) {
            console.error('Delete quote error:', error);
            alert(`تعذر حذف العرض.\n${error.message || error}`);
        }
    }

    if (btnSaveQuote) btnSaveQuote.addEventListener('click', updateManagerQuote);
    if (btnHistory) btnHistory.addEventListener('click', openHistoryModal);
    if (btnManagerLogin) btnManagerLogin.addEventListener('click', handleManagerButton);
    if (managerLoginForm) managerLoginForm.addEventListener('submit', handleManagerLogin);
    if (btnCloseManagerLogin) btnCloseManagerLogin.addEventListener('click', closeManagerLoginModal);
    if (managerLoginModal) managerLoginModal.querySelectorAll('[data-close-manager-modal]').forEach(el => el.addEventListener('click', closeManagerLoginModal));
    if (btnCloseHistory) btnCloseHistory.addEventListener('click', closeHistoryModal);
    if (historyModal) historyModal.querySelectorAll('[data-close-quote-modal]').forEach(el => el.addEventListener('click', closeHistoryModal));
    if (btnHistoryRefresh) btnHistoryRefresh.addEventListener('click', loadQuoteHistory);
    if (historySearch) historySearch.addEventListener('input', () => {
        clearTimeout(historySearch._timer);
        historySearch._timer = setTimeout(loadQuoteHistory, 300);
    });
    if (historyTbody) historyTbody.addEventListener('click', event => {
        const openButton = event.target.closest('[data-open-quote]');
        if (openButton) openSavedQuote(openButton.getAttribute('data-open-quote'));
        const pdfButton = event.target.closest('[data-pdf-quote]');
        if (pdfButton) downloadSavedQuotePdf(pdfButton.getAttribute('data-pdf-quote'));
        const deleteButton = event.target.closest('[data-delete-quote]');
        if (deleteButton) deleteSavedQuote(deleteButton.getAttribute('data-delete-quote'));
    });

    document.addEventListener('input', event => {
        if (event.target.matches('#client-name, #quote-date, #quote-ref, #terms-ar, #terms-en, input[data-index], select[data-index], textarea')) markQuoteDirty();
    });
    document.addEventListener('change', event => {
        if (event.target.matches('#client-name, #quote-date, #quote-ref, #terms-ar, #terms-en, input[data-index], select[data-index]')) markQuoteDirty();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') { closeHistoryModal(); closeManagerLoginModal(); }
    });

    if (supabaseClient) {
        supabaseClient.auth.getSession().then(async ({ data }) => {
            if (data?.session?.user && await verifyManager(data.session.user)) {
                setManagerUI(true, data.session.user);
            } else {
                setManagerUI(false, null);
            }
        });
        supabaseClient.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user && await verifyManager(session.user)) setManagerUI(true, session.user);
            else setManagerUI(false, null);
        });
    } else {
        setManagerUI(false, null);
    }

    // إخراج PDF: يتم إنشاء نفس ملف A4 الذي يُنزّل للمستخدم، ثم حفظ نسخة منه في Supabase Storage.
    async function handlePdfExport(mode, button) {
        if (!button) return;
        const originalLabel = button.innerHTML;
        const loadingText = mode === 'desktop' ? 'جاري تجهيز PDF للكمبيوتر...' : 'جاري تجهيز PDF للجوال...';
        button.innerText = loadingText;
        button.disabled = true;
        if (btnExportPdfMobile) btnExportPdfMobile.disabled = true;
        if (btnExportPdfDesktop) btnExportPdfDesktop.disabled = true;
        document.body.classList.add('rendering-pdf');
        try {
            const quoteId = await ensureSavedBeforeOutput(mode);
            if (!quoteId) return;
            // تم حفظ نسخة PDF بالفعل عند إنشاء العرض. ننشئ نسخة محلية مطابقة لتنزيلها للمستخدم.
            const generated = await buildPdfBlob(mode);
            const url = URL.createObjectURL(generated.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = generated.filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 30000);
        } catch (err) {
            console.error(`PDF ${mode} export error:`, err);
            alert('حدث خطأ أثناء إنشاء أو حفظ ملف PDF، يرجى المحاولة مرة أخرى.');
        } finally {
            document.body.classList.remove('rendering-pdf');
            button.innerHTML = originalLabel;
            if (btnExportPdfMobile) btnExportPdfMobile.disabled = false;
            if (btnExportPdfDesktop) btnExportPdfDesktop.disabled = false;
        }
    }

    if (btnExportPdfMobile) btnExportPdfMobile.addEventListener('click', () => handlePdfExport('mobile', btnExportPdfMobile));
    if (btnExportPdfDesktop) btnExportPdfDesktop.addEventListener('click', () => handlePdfExport('desktop', btnExportPdfDesktop));

    // الترجمة التلقائية لمربع الملاحظات والشروط
    const termsAr = document.getElementById('terms-ar');
    const termsEn = document.getElementById('terms-en');
    let translateTimeout;

    if (termsAr && termsEn) {
        termsAr.addEventListener('input', () => {
            clearTimeout(translateTimeout);
            const text = termsAr.value.trim();
            if (!text) {
                termsEn.value = '';
                return;
            }

            translateTimeout = setTimeout(() => {
                fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(text)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data[0]) {
                            termsEn.value = data[0].map(item => item[0]).join('');
                        }
                    })
                    .catch(err => console.error('Translation error:', err));
            }, 500);
        });
    }

    generateAutoMeta();
    renderItems();

});
