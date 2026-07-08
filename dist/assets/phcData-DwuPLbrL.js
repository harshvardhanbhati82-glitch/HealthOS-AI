const i=[{id:"phc-001",name:"PHC Rampur",lat:26.4499,lng:80.3319,doctors:3,patientsToday:87,medicineStock:"Good",medicineStockPercent:78,riskLevel:"Low",block:"Rampur Block",beds:10,activeCases:12,equipment:[{name:"ECG Machine",status:"Operational",lastChecked:"2026-07-01"},{name:"X-Ray Unit",status:"Under Repair",lastChecked:"2026-06-28"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-05"},{name:"Glucometer",status:"Operational",lastChecked:"2026-07-05"}],vaccinations:[{name:"COVID-19",target:500,achieved:423},{name:"Polio",target:200,achieved:198},{name:"Measles",target:150,achieved:112}],aiRecommendation:"X-Ray unit repair should be prioritized. Consider increasing doctor availability on weekends given patient load trend."},{id:"phc-002",name:"PHC Kanpur Rural",lat:26.5124,lng:80.2345,doctors:2,patientsToday:134,medicineStock:"Low",medicineStockPercent:28,riskLevel:"High",block:"Kanpur Rural Block",beds:8,activeCases:34,equipment:[{name:"ECG Machine",status:"Operational",lastChecked:"2026-07-03"},{name:"Ultrasound",status:"Non-Functional",lastChecked:"2026-06-15"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-06"},{name:"Nebulizer",status:"Operational",lastChecked:"2026-07-04"}],vaccinations:[{name:"COVID-19",target:600,achieved:310},{name:"Polio",target:250,achieved:201},{name:"Measles",target:180,achieved:90}],aiRecommendation:"URGENT: Medicine stock critically low for antibiotics and ORS. Request emergency resupply. High patient-to-doctor ratio requires additional staff deployment."},{id:"phc-003",name:"PHC Ghatampur",lat:26.2765,lng:80.0689,doctors:4,patientsToday:62,medicineStock:"Good",medicineStockPercent:91,riskLevel:"Low",block:"Ghatampur Block",beds:15,activeCases:8,equipment:[{name:"ECG Machine",status:"Operational",lastChecked:"2026-07-06"},{name:"X-Ray Unit",status:"Operational",lastChecked:"2026-07-06"},{name:"Ventilator",status:"Operational",lastChecked:"2026-07-04"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-07"}],vaccinations:[{name:"COVID-19",target:400,achieved:390},{name:"Polio",target:180,achieved:179},{name:"Measles",target:120,achieved:118}],aiRecommendation:"This PHC is performing excellently. Consider using it as a training hub for other PHC staff. Share medicine stock with Kanpur Rural PHC."},{id:"phc-004",name:"PHC Bilhaur",lat:26.8461,lng:79.9123,doctors:1,patientsToday:98,medicineStock:"Critical",medicineStockPercent:12,riskLevel:"Critical",block:"Bilhaur Block",beds:6,activeCases:45,equipment:[{name:"ECG Machine",status:"Non-Functional",lastChecked:"2026-06-20"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-05"},{name:"Glucometer",status:"Under Repair",lastChecked:"2026-06-30"},{name:"Nebulizer",status:"Non-Functional",lastChecked:"2026-06-25"}],vaccinations:[{name:"COVID-19",target:450,achieved:180},{name:"Polio",target:200,achieved:98},{name:"Measles",target:160,achieved:55}],aiRecommendation:"CRITICAL ALERT: Single doctor serving 98 patients with critical medicine shortage. Immediate intervention required. Deploy mobile medical unit. Request emergency medicine supply within 24 hours."},{id:"phc-005",name:"PHC Bhognipur",lat:26.2098,lng:79.9456,doctors:2,patientsToday:71,medicineStock:"Low",medicineStockPercent:35,riskLevel:"Medium",block:"Bhognipur Block",beds:10,activeCases:19,equipment:[{name:"ECG Machine",status:"Operational",lastChecked:"2026-07-02"},{name:"X-Ray Unit",status:"Operational",lastChecked:"2026-07-01"},{name:"BP Monitor",status:"Under Repair",lastChecked:"2026-06-29"},{name:"Ultrasound",status:"Operational",lastChecked:"2026-07-03"}],vaccinations:[{name:"COVID-19",target:350,achieved:242},{name:"Polio",target:150,achieved:130},{name:"Measles",target:100,achieved:78}],aiRecommendation:"Medicine restock due in 2 weeks. Prioritize ORS and antibiotics. BP monitor repair needed. Vaccination drive recommended for measles coverage gap."},{id:"phc-006",name:"PHC Akbarpur",lat:26.6023,lng:80.4512,doctors:3,patientsToday:55,medicineStock:"Good",medicineStockPercent:65,riskLevel:"Low",block:"Akbarpur Block",beds:12,activeCases:10,equipment:[{name:"ECG Machine",status:"Operational",lastChecked:"2026-07-05"},{name:"X-Ray Unit",status:"Operational",lastChecked:"2026-07-04"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-07"},{name:"Glucometer",status:"Operational",lastChecked:"2026-07-06"}],vaccinations:[{name:"COVID-19",target:380,achieved:355},{name:"Polio",target:160,achieved:158},{name:"Measles",target:110,achieved:105}],aiRecommendation:"PHC performing well. Plan medicine restock within 3 weeks. Continue current vaccination pace to achieve 100% coverage by month end."},{id:"phc-007",name:"PHC Sarbananda",lat:26.3872,lng:80.1234,doctors:2,patientsToday:112,medicineStock:"Low",medicineStockPercent:22,riskLevel:"High",block:"Sarbananda Block",beds:8,activeCases:28,equipment:[{name:"ECG Machine",status:"Under Repair",lastChecked:"2026-06-27"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-06"},{name:"Glucometer",status:"Operational",lastChecked:"2026-07-05"},{name:"Nebulizer",status:"Operational",lastChecked:"2026-07-04"}],vaccinations:[{name:"COVID-19",target:520,achieved:290},{name:"Polio",target:220,achieved:180},{name:"Measles",target:170,achieved:95}],aiRecommendation:"High patient load with insufficient medicine supply. ECG machine repair critical. Deploy additional doctor from Ghatampur PHC on rotation. Immediate medicine resupply needed."},{id:"phc-008",name:"PHC Pukhrayan",lat:26.189,lng:79.8334,doctors:3,patientsToday:43,medicineStock:"Good",medicineStockPercent:82,riskLevel:"Low",block:"Pukhrayan Block",beds:14,activeCases:7,equipment:[{name:"ECG Machine",status:"Operational",lastChecked:"2026-07-06"},{name:"X-Ray Unit",status:"Operational",lastChecked:"2026-07-05"},{name:"Ventilator",status:"Operational",lastChecked:"2026-07-03"},{name:"BP Monitor",status:"Operational",lastChecked:"2026-07-07"}],vaccinations:[{name:"COVID-19",target:300,achieved:289},{name:"Polio",target:130,achieved:130},{name:"Measles",target:90,achieved:88}],aiRecommendation:"Excellent operational status. PHC has capacity to support nearby high-risk facilities. Consider cross-training staff for emergency protocols."}],n={totalPHCs:8,activeDoctors:20,patientsToday:662,criticalAlerts:2,vaccinationRate:72,medicineStockHealth:64},o=i.map(e=>({id:e.id,phcName:e.name,block:e.block,doctors:e.doctors,patients:e.patientsToday,medicineStock:e.medicineStock,riskLevel:e.riskLevel,vaccinations:e.vaccinations.reduce((a,t)=>a+t.achieved,0),activeCases:e.activeCases,date:new Date().toLocaleDateString("en-IN")})),r=[{id:"pred-001",title:"Dengue Outbreak Risk",description:"Rising mosquito breeding sites detected near Bilhaur and Sarbananda blocks after recent rainfall.",riskScore:82,confidence:87,recommendedAction:"Deploy fogging units and distribute mosquito nets in high-risk zones. Increase surveillance in Bilhaur and Sarbananda PHCs.",lastUpdated:"2026-07-08T08:30:00",trend:"up",category:"disease",affectedAreas:["Bilhaur Block","Sarbananda Block","Rampur Block"]},{id:"pred-002",title:"Medicine Stock Depletion",description:"Antibiotics and ORS stocks projected to reach critical levels in 3 PHCs within 5 days.",riskScore:76,confidence:94,recommendedAction:"Issue emergency procurement order for antibiotics (Amoxicillin, Azithromycin) and ORS. Redistribute from Ghatampur PHC stocks.",lastUpdated:"2026-07-08T09:00:00",trend:"up",category:"resource",affectedAreas:["Bilhaur Block","Kanpur Rural Block","Sarbananda Block"]},{id:"pred-003",title:"Measles Vaccination Gap",description:"Coverage below 60% in 4 PHCs. Herd immunity threshold at risk if coverage not improved by August.",riskScore:61,confidence:91,recommendedAction:"Organise mobile vaccination camps in underserved villages. Partner with ASHA workers for door-to-door campaigns.",lastUpdated:"2026-07-07T17:00:00",trend:"stable",category:"vaccination",affectedAreas:["Bilhaur Block","Bhognipur Block","Sarbananda Block","Kanpur Rural Block"]},{id:"pred-004",title:"Doctor Shortage Emergency",description:"Two PHCs operating with single doctor. Patient load exceeding safe capacity thresholds.",riskScore:89,confidence:96,recommendedAction:"Immediately transfer 2 doctors from low-load PHCs. Request district health officer approval for temporary deputation.",lastUpdated:"2026-07-08T10:00:00",trend:"up",category:"emergency",affectedAreas:["Bilhaur Block","Kanpur Rural Block"]},{id:"pred-005",title:"Monsoon Disease Surge",description:"Historical data indicates 40% spike in waterborne disease cases during monsoon (July–August).",riskScore:55,confidence:83,recommendedAction:"Stock up on ORS, chlorine tablets, and IV fluids. Brief all PHC staff on diarrhoea and cholera protocols.",lastUpdated:"2026-07-07T12:00:00",trend:"stable",category:"disease",affectedAreas:["All Blocks"]},{id:"pred-006",title:"Equipment Failure Risk",description:"6 critical equipment units across 4 PHCs under repair or non-functional. Risk of diagnostic gaps.",riskScore:48,confidence:79,recommendedAction:"Assign biomedical engineer for weekly rounds. Prioritise ECG and nebulizer repair in Bilhaur PHC.",lastUpdated:"2026-07-06T15:30:00",trend:"down",category:"resource",affectedAreas:["Bilhaur Block","Sarbananda Block","Rampur Block","Bhognipur Block"]}],c=["What are the critical alerts across all PHCs today?","Which PHCs have medicine stock below 30%?","Give me a vaccination coverage summary for the district.","Which blocks are at highest risk for disease outbreak?","Suggest resource reallocation to improve district health outcomes."],s={critical:`**Critical Alerts — District Health Summary**

🔴 **PHC Bilhaur (CRITICAL)**
- Single doctor managing 98 patients
- Medicine stock at 12% — emergency resupply needed within 24 hours
- ECG machine and nebulizer non-functional

🔴 **PHC Kanpur Rural (HIGH)**
- Medicine stock at 28% with high patient load (134 patients)
- Ultrasound machine non-functional
- Vaccination coverage below 55%

🟡 **PHC Sarbananda (HIGH)**
- Medicine stock at 22%
- ECG under repair
- 112 patients with only 2 doctors

**Recommended Immediate Actions:**
1. Deploy emergency medicine kit to Bilhaur PHC
2. Transfer one doctor from Ghatampur to Bilhaur
3. Request district-level intervention for Kanpur Rural`,medicine:`**Medicine Stock Analysis — All PHCs**

| PHC | Stock Level | Status |
|-----|-------------|--------|
| Bilhaur | 12% | 🔴 Critical |
| Sarbananda | 22% | 🔴 Critical |
| Kanpur Rural | 28% | 🟡 Low |
| Bhognipur | 35% | 🟡 Low |
| Akbarpur | 65% | 🟢 Good |
| Rampur | 78% | 🟢 Good |
| Pukhrayan | 82% | 🟢 Good |
| Ghatampur | 91% | 🟢 Excellent |

**PHCs below 30% stock (Emergency tier):**
- **PHC Bilhaur** and **PHC Sarbananda** require immediate procurement action.

**Suggestion:** Redistribute surplus stock from Ghatampur (91%) and Pukhrayan (82%) to bridge the gap while emergency procurement is processed.`,vaccination:`**Vaccination Coverage Report — Kanpur District**

📊 **Overall Coverage: 72%**

**COVID-19 Vaccination**
- District Average: 74%
- Best: Ghatampur PHC (97%)
- Worst: Bilhaur PHC (40%)

**Polio Vaccination**
- District Average: 87%
- Best: Pukhrayan PHC (100%)
- Worst: Bilhaur PHC (49%)

**Measles Vaccination**
- District Average: 68%
- Best: Pukhrayan PHC (98%)
- Worst: Bilhaur PHC (34%)

⚠️ **Critical Gap:** Measles coverage in Bilhaur, Bhognipur, and Sarbananda blocks is below the 70% herd immunity threshold.

**Recommended Actions:**
1. Mobile vaccination camps in Bilhaur (priority)
2. ASHA-led household campaigns in Sarbananda
3. Weekend vaccination drives in Bhognipur`,outbreak:`**Disease Outbreak Risk Assessment**

🔴 **HIGH RISK — Bilhaur Block**
- Risk Score: 89/100
- Factors: Critical medicine shortage, equipment failures, single doctor
- Primary concern: Undetected cases going untreated

🔴 **HIGH RISK — Kanpur Rural Block**
- Risk Score: 76/100
- Factors: High patient load, low vaccination coverage, medicine shortage
- Primary concern: Dengue spread post-monsoon

🟡 **MEDIUM RISK — Sarbananda Block**
- Risk Score: 65/100
- Factors: Low medicine stock, ECG under repair
- Primary concern: Waterborne diseases during monsoon

🟢 **LOW RISK Blocks:** Rampur, Akbarpur, Ghatampur, Pukhrayan, Bhognipur

**Seasonal Alert:** Monsoon season (July–August) historically increases disease load by 40%. Prepare all PHCs with ORS, chlorine tablets, and IV fluids.`,reallocation:`**Resource Reallocation Recommendations**

**Doctor Reallocation**
| From | To | Reason |
|------|----|--------|
| Ghatampur (4 doctors) | Bilhaur (1 doctor) | Critical shortage |
| Pukhrayan (3 doctors) | Kanpur Rural (2 doctors) | High patient load |

**Medicine Redistribution**
| From | To | Items |
|------|----|-----------|
| Ghatampur (91%) | Bilhaur (12%) | Antibiotics, ORS |
| Pukhrayan (82%) | Sarbananda (22%) | ORS, Paracetamol |

**Equipment Priorities**
1. Bilhaur — ECG machine & nebulizer (URGENT)
2. Sarbananda — ECG machine repair
3. Rampur — X-Ray unit repair

**Estimated Impact:**
- Reducing Bilhaur risk from Critical → Medium within 48 hours
- Reducing Kanpur Rural risk from High → Medium within 72 hours
- District overall risk score improvement: ~23%`,default:`I'm your **HealthOS AI Copilot** for Kanpur District health management. I can help you with:

- 📊 Real-time PHC status and critical alerts
- 💊 Medicine stock analysis and procurement recommendations
- 💉 Vaccination coverage tracking and gap analysis
- 🦟 Disease outbreak risk assessment and prevention
- 👨‍⚕️ Doctor and resource reallocation strategies
- 📈 Predictive health analytics

You can ask me specific questions about any PHC, block, or district-level health issue. I have access to data from all 8 PHCs across Kanpur district.

What would you like to know?`};export{c as A,n as D,i as P,o as R,r as a,s as b};
