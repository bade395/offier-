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
    const btnExportPdf = document.getElementById('btn-export-pdf');

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

    btnExportPdf.addEventListener('click', async () => {
        const element = document.getElementById('document-to-pdf');
        const refVal = quoteRefInput.value || 'Quotation';
        
        btnExportPdf.innerText = 'جاري التحميل...';
        btnExportPdf.disabled = true;

        document.body.classList.add('rendering-pdf');

        if (document.fonts) {
            await document.fonts.ready;
        }

        const opt = {
            margin:       0,
            filename:     `عرض_سعر_${refVal}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                letterRendering: true,
                scrollY: 0,
                scrollX: 0
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak:    { mode: ['css', 'legacy'] }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء تنزيل الملف، يرجى المحاولة مرة أخرى.');
        } finally {
            document.body.classList.remove('rendering-pdf');
            btnExportPdf.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> تصدير PDF`;
            btnExportPdf.disabled = false;
        }
    });

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
