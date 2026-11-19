import sys
d='/tmp/claude-0/-home-claude/822fa44c-6d8c-530e-893a-a82e8e025842/scratchpad/app/'
mode=sys.argv[1]
head=open(d+'head.html',encoding='utf8').read()
three='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' if mode=='prod' else 'three.min.js'
js=''.join(open(d+f,encoding='utf8').read()+'\n' for f in ['engine.js','content.js','content_l1.js','content_l2.js','content_l1b.js','content_l2b.js','content_l3b.js','content_l4b.js','content_l5b.js','content_l6b.js','content_l7b.js','content_l8b.js','content_l9b.js','content_l10b.js','content_l11.js','content_l12.js','content_end.js','gram.js','gram2.js','gram3.js','gram4.js','gram5.js','gram6.js','gram7.js','gram8.js','reading.js','reading_a1.js','reading_a2.js','reading_b1.js','reading_b2.js','reading_c1.js','reading_c2.js','listen.js','dict.js','piper.js','app.js','app2.js','speak.js'])
ms='/tmp/claude-0/-home-claude/822fa44c-6d8c-530e-893a-a82e8e025842/scratchpad/ms/out/'
msjs='<script>\n'+open(ms+'mespeak.bundle.js',encoding='utf8').read()+'\nwindow.__MSCFG='+open(ms+'mespeak_config.json',encoding='utf8').read()+';window.__MSVOICE='+open(ms+'voice-en-us.json',encoding='utf8').read()+';\n</script>\n'+'<script>\n'+open(d+'ort.wasm.min.js',encoding='utf8').read()+'\n</script>\n<script>\n'+open(d+'phon.js',encoding='utf8').read()+'\n</script>\n'
out=('<meta charset="utf-8">' if mode!='prod' else '')+head+'\n'+msjs+'<script src="'+three+'"></script>\n<script>\n'+js+'</script>\n'
open(d+('index.html' if mode=='prod' else 'test.html'),'w',encoding='utf8').write(out)
print(len(out))
