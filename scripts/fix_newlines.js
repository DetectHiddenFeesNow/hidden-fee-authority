var f="C:/vhub/content/healthcare-costs-2026.md";var c=require("fs").readFileSync(f,"utf8");c=c.split("\\n").join("\n");require("fs").writeFileSync(f,c);console.log("Fixed");
