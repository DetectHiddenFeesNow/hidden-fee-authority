data.forEach(function(d){var md=render(d.slug,d.title,d.desc,d.hub,d.subs);fs.writeFileSync(dir+"/"+d.slug+".md",md);console.log("Created: "+d.slug)});
