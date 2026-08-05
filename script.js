document.addEventListener('DOMContentLoaded', () => {

    // Initial state matching original PDF document
    const defaultItems = [
        { carType: 'KIA PEGAS', quantity: '1', duration: '1', typeOfRent: 'Yearly / سنوي', rentalPrice: '1869.60' },
        { carType: 'Suzuki Dzire or Similar', quantity: '1', duration: '1', typeOfRent: 'Yearly / سنوي', rentalPrice: '1869.60' },
        { carType: 'HYUNDAI GRAND i10', quantity: '1', duration: '1', typeOfRent: 'Yearly / سنوي', rentalPrice: '1869.60' }
    ];

    let items = JSON.parse(JSON.stringify(defaultItems));

    // DOM Elements
    const itemsTbody = document.getElementById('items-tbody');
    const sumNetElem = document.getElementById('sum-net');
    const sumVatElem = document.getElementById('sum-vat');
    const sumGrandElem = document.getElementById('sum-grand');
    const quoteDateInput = document.getElementById('quote-date');
    const quoteRefInput = document.getElementById('quote-ref');

    // Controls
    const btnAddItem = document.getElementById('btn-add-item');
    const btnGenRef = document.getElementById('btn-gen-ref');
    const btnReset = document.getElementById('btn-reset');
    const btnPrintPdf = document.getElementById('btn-print-pdf');

    // Saudi Riyal New Symbol (^ in Rubik ExtraBold = new riyal glyph)
    const RIYAL = '<span class="riyal-symbol">^</span>';

    // Format number to standard decimal
    function formatMoney(amount, decimals = 1) {
        if (isNaN(amount)) return '0.0';
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: 2
        });
    }

    // Safely parse a raw string to a number (allows partial decimal like "1." while typing)
    function parseNum(str, isDecimal = false) {
        const clean = String(str).replace(/[^\d.]/g, '');
        const n = isDecimal ? parseFloat(clean) : parseInt(clean);
        return isNaN(n) ? 0 : n;
    }

    // Generate Auto Reference Number & Date
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

    // Recalculate and update only the totals without re-rendering inputs
    function updateTotals() {
        let totalNet = 0, totalVat = 0, totalGrand = 0;

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

            // Update only the calculated (read-only) cells in this row
            const row = itemsTbody.rows[index];
            if (row) {
                // Columns: 0=carType, 1=qty, 2=dur, 3=typeOfRent, 4=price, 5=total, 6=vat, 7=grand, 8=action
                row.cells[5].innerHTML = formatMoney(lineTotal, 1);
                row.cells[6].innerHTML = formatMoney(lineVat, 1);
                row.cells[7].innerHTML = formatMoney(lineGrand, 1);
            }
        });

        sumNetElem.textContent = formatMoney(totalNet, 2);
        sumVatElem.textContent = formatMoney(totalVat, 2);
        sumGrandElem.textContent = formatMoney(totalGrand, 2);
    }

    // Full render — only called when rows are added/removed
    function renderItems() {
        itemsTbody.innerHTML = '';

        items.forEach((item, index) => {
            const qty = parseNum(item.quantity, false);
            const dur = parseNum(item.duration, false);
            const price = parseNum(item.rentalPrice, true);
            const lineTotal = qty * dur * price;
            const lineVat = lineTotal * 0.15;
            const lineGrand = lineTotal + lineVat;

            const tr = document.createElement('tr');
            tr.setAttribute('data-row', index);
            tr.innerHTML = `
                <td>
                    <input type="text" class="editable-field table-input" value="${item.carType}" data-index="${index}" data-key="carType" placeholder="نوع السيارة">
                </td>
                <td>
                    <input type="text" inputmode="numeric" class="editable-field table-input" value="${item.quantity}" data-index="${index}" data-key="quantity" placeholder="1">
                </td>
                <td>
                    <input type="text" inputmode="numeric" class="editable-field table-input" value="${item.duration}" data-index="${index}" data-key="duration" placeholder="1">
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
                <td>${formatMoney(lineTotal, 1)}</td>
                <td>${formatMoney(lineVat, 1)}</td>
                <td>${formatMoney(lineGrand, 1)}</td>
                <td class="no-print row-action-col">
                    ${items.length > 1 ? `<button type="button" class="btn-del-row" data-index="${index}">×</button>` : ''}
                </td>
            `;
            itemsTbody.appendChild(tr);
        });

        updateTotals();
        attachInputListeners();
    }

    // Attach listeners — update data without re-rendering the whole table
    function attachInputListeners() {
        document.querySelectorAll('[data-index]').forEach(input => {
            // Prevent multiple listener bindings
            const clone = input.cloneNode(true);
            input.parentNode.replaceChild(clone, input);
        });

        document.querySelectorAll('[data-index]').forEach(el => {
            const isSelect = el.tagName === 'SELECT';
            el.addEventListener(isSelect ? 'change' : 'input', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const key = e.target.getAttribute('data-key');
                const rawVal = e.target.value;

                // Store raw string as-is for text fields (allows "1." while typing)
                items[idx][key] = rawVal;

                // Only update calculated cells, NOT the inputs
                updateTotals();
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

    // Add Row Action
    btnAddItem.addEventListener('click', () => {
        items.push({
            carType: 'سيارة جديدة / New Car',
            quantity: '1',
            duration: '1',
            typeOfRent: 'Yearly / سنوي',
            rentalPrice: '1500.00'
        });
        renderItems();
    });

    // Regenerate Ref & Date
    btnGenRef.addEventListener('click', () => {
        generateAutoMeta();
    });

    // Reset Action
    btnReset.addEventListener('click', () => {
        if (confirm('هل أنت تأكد من إعادة ضبط البيانات إلى الحالة الأصلية؟')) {
            items = JSON.parse(JSON.stringify(defaultItems));
            document.getElementById('client-name').value = 'شركة المهمة الذكية لخدمات الأعمال';
            generateAutoMeta();
            renderItems();
        }
    });

    // Print / Export PDF Action
    btnPrintPdf.addEventListener('click', () => {
        window.print();
    });

    // Initial Setup
    generateAutoMeta();
    renderItems();

});
