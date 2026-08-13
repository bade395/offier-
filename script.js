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
    });

    btnReset.addEventListener('click', () => {
        if (confirm('هل أنت تأكد من إعادة ضبط البيانات إلى الحالة الأصلية؟')) {
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

    btnPrint.addEventListener('click', () => {
        window.print();
    });

    // تصدير PDF بمقاس A4 ثابت. يوجد مساران منفصلان:
    // 1) الجوال: إخراج مستقل لا يتأثر بعرض شاشة الهاتف.
    // 2) الكمبيوتر: يطبق نفس قواعد نسخة الطباعة الخاصة بالكمبيوتر قبل التصوير.
    async function exportPdfAsA4(mode = 'mobile', button = null) {
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
            'position:fixed',
            'left:-100000px',
            'top:0',
            `width:${A4_WIDTH_PX}px`,
            `height:${A4_HEIGHT_PX}px`,
            'overflow:hidden',
            'margin:0',
            'padding:0',
            'background:#ffffff',
            'z-index:-1',
            'pointer-events:none'
        ].join(';');
        document.body.appendChild(stage);

        const exportStyle = document.createElement('style');
        exportStyle.textContent = `
            #pdf-export-stage,
            #pdf-export-stage * { box-sizing: border-box !important; }
            #pdf-export-stage .a4-page {
                width: 210mm !important;
                height: 297mm !important;
                min-width: 210mm !important;
                max-width: 210mm !important;
                min-height: 297mm !important;
                max-height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: hidden !important;
                position: relative !important;
                display: block !important;
                box-shadow: none !important;
                border: 0 !important;
                page-break-after: auto !important;
                break-after: auto !important;
                transform: none !important;
                zoom: 1 !important;
                background-size: 100% 100% !important;
                background-repeat: no-repeat !important;
                background-position: center center !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            #pdf-export-stage .no-print,
            #pdf-export-stage .btn-toggle-select,
            #pdf-export-stage .row-action-col { display: none !important; }

            #pdf-export-stage .editable-field {
                border: none !important;
                border-color: transparent !important;
                background: transparent !important;
                box-shadow: none !important;
                outline: none !important;
                padding: 0 !important;
            }

            #pdf-export-stage .table-select,
            #pdf-export-stage .car-type-select {
                appearance: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                border: none !important;
                background: transparent !important;
                box-shadow: none !important;
                outline: none !important;
                color: #000000 !important;
                text-align: center !important;
                text-align-last: center !important;
                width: 100% !important;
                padding: 0 !important;
            }

            #pdf-export-stage .terms-box textarea {
                border: none !important;
                background: transparent !important;
                resize: none !important;
                outline: none !important;
            }

            /* محاكاة قواعد @media print الخاصة بنسخة الكمبيوتر */
            #pdf-export-stage.pdf-export-stage-desktop .a4-page {
                height: 296mm !important;
                min-height: 296mm !important;
                max-height: 296mm !important;
            }
            #pdf-export-stage.pdf-export-stage-desktop .table-select,
            #pdf-export-stage.pdf-export-stage-desktop .car-type-select {
                font-size: 0.74rem !important;
                font-weight: 800 !important;
                color: #000000 !important;
            }
            #pdf-export-stage.pdf-export-stage-desktop .terms-box textarea {
                background: transparent !important;
            }
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
                    Array.from(target.options).forEach(option => {
                        option.selected = option.value === field.value;
                    });
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
                    scale: renderScale,
                    width: A4_WIDTH_PX,
                    height: A4_HEIGHT_PX,
                    windowWidth: A4_WIDTH_PX,
                    windowHeight: A4_HEIGHT_PX,
                    x: 0,
                    y: 0,
                    scrollX: 0,
                    scrollY: 0,
                    useCORS: true,
                    allowTaint: false,
                    backgroundColor: '#ffffff',
                    imageTimeout: 15000,
                    logging: false,
                    removeContainer: true
                });

                if (i > 0) pdf.addPage('a4', 'portrait');

                const imageData = canvas.toDataURL('image/png');
                pdf.addImage(imageData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'FAST');
                stage.removeChild(clone);
            }

            const refVal = quoteRefInput.value || 'Quotation';
            const suffix = mode === 'desktop' ? 'كمبيوتر' : 'جوال';
            pdf.save(`عرض_سعر_${refVal}_${suffix}.pdf`);
        } finally {
            stage.remove();
        }
    }

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
            await exportPdfAsA4(mode, button);
        } catch (err) {
            console.error(`PDF ${mode} export error:`, err);
            alert('حدث خطأ أثناء تنزيل الملف، يرجى المحاولة مرة أخرى.');
        } finally {
            document.body.classList.remove('rendering-pdf');
            button.innerHTML = originalLabel;
            if (btnExportPdfMobile) btnExportPdfMobile.disabled = false;
            if (btnExportPdfDesktop) btnExportPdfDesktop.disabled = false;
        }
    }

    if (btnExportPdfMobile) {
        btnExportPdfMobile.addEventListener('click', () => handlePdfExport('mobile', btnExportPdfMobile));
    }

    if (btnExportPdfDesktop) {
        btnExportPdfDesktop.addEventListener('click', () => handlePdfExport('desktop', btnExportPdfDesktop));
    }

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
