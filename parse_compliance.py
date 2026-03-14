import json
import os

with open("extracted_compliance.txt", "r", encoding="utf-8") as f:
    lines = [line.strip() for line in f if line.strip()]

data = []
current_policy = None
current_section = None

policies = [
    "TERMS AND CONDITIONS",
    "PRIVACY POLICY",
    "REFUND AND PAYMENT POLICY",
    "ROYALTY POLICY ADDENDUM",
    "AI DISCLOSURE AND CONTENT INTEGRITY POLICY",
    "WEBSITE DISCLAIMER",
    "COOKIE POLICY",
    "CONTRIBUTION TERMS ADDENDUM"
]

for line in lines:
    if line in policies:
        if current_section and current_policy:
            current_policy["sections"].append(current_section)
        if current_policy:
            data.append(current_policy)
        current_policy = {"title": line, "sections": []}
        current_section = {"title": "Introduction", "content": []}
        continue
        
    if not current_policy:
        continue
        
    # Check if line is a numbered section like "1. Acceptance of Terms"
    if line[0].isdigit() and ". " in line[:5]:
        if current_section:
            if current_section["content"] or current_section["title"] != "Introduction":
                current_policy["sections"].append(current_section)
        current_section = {"title": line, "content": []}
    else:
        if current_section:
            current_section["content"].append(line)

if current_section and current_policy:
    current_policy["sections"].append(current_section)
if current_policy:
    data.append(current_policy)

os.makedirs("app/compliance", exist_ok=True)
with open("app/compliance/compliance_data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)
