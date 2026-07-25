var fs=require("fs"),j=JSON.parse(fs.readFileSync(process.argv[2],"utf8"));fs.writeFileSync(j.path,j.content);console.log("Written: "+j.path+" ("+j.content.length+" bytes)");
