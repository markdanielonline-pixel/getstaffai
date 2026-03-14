const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('extracted_compliance.txt', 'utf-8');
const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line);

const data = [];
let current_policy = null;
let current_section = null;

const policies = [
    "TERMS AND CONDITIONS",
    "PRIVACY POLICY",
    "REFUND AND PAYMENT POLICY",
    "ROYALTY POLICY ADDENDUM",
    "AI DISCLOSURE AND CONTENT INTEGRITY POLICY",
    "WEBSITE DISCLAIMER",
    "COOKIE POLICY",
    "CONTRIBUTION TERMS ADDENDUM"
];

for (const line of lines) {
    if (policies.includes(line)) {
        if (current_section && current_policy) {
            if (current_section.content.length > 0 || current_section.title !== "Introduction") {
                current_policy.sections.push(current_section);
            }
        }
        if (current_policy) {
            data.push(current_policy);
        }
        current_policy = { title: line, sections: [] };
        current_section = { title: "Introduction", content: [] };
        continue;
    }
    
    if (!current_policy) continue;
    
    // Check if line is a numbered section like "1. Acceptance of Terms"
    if (/^\d+\.\s/.test(line)) {
        if (current_section) {
            if (current_section.content.length > 0 || current_section.title !== "Introduction") {
                current_policy.sections.push(current_section);
            }
        }
        current_section = { title: line, content: [] };
    } else {
        if (current_section) {
            current_section.content.push(line);
        }
    }
}

if (current_section && current_policy) {
    if (current_section.content.length > 0 || current_section.title !== "Introduction") {
        current_policy.sections.push(current_section);
    }
}
if (current_policy) {
    data.push(current_policy);
}

const dir = path.join(__dirname, 'app', 'compliance');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(path.join(dir, 'complianceData.json'), JSON.stringify(data, null, 2));
console.log('Done parsing.');
