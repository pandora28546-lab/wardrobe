import base64,sys,os
from PIL import Image
import io
src=sys.argv[1];out=sys.argv[2]
R='/home/claude/wardrobe/'
W=R+'w2/';E='/home/claude/ext/'
def du(p,mime):
    return 'data:%s;base64,'%mime+base64.b64encode(open(p,'rb').read()).decode()
s=open(src).read()
m={'SPLASH':'splash','SPLASH1':'splash1','RAIN':'rain','UMBRELLA':'umbrella','CLICK':'click','BELL':'bell','STEPS':'steps','CHOP':'chop','CLANK':'clank','BLOW':'blow','KICK':'kick','POP':'pop','BUBBLES':'bubbles','SNOWBALL':'snowball','LEAVES':'leaves','DRESS':'dress','DR2':'kalimba',
 'AMBS':'amb-summer','AMBR':'amb-rain','AMBA':'amb-autumn','AMBW':'amb-winter','AMBG':'amb-gym','AMBPA':'amb-party','AMBP':'amb-pool','AMBN':'amb-night','AMBF':'amb-whistle','AMBK':'amb-kitchen'}
for k,f in m.items(): s=s.replace('%%'+k+'%%',du(W+f+'.m4a','audio/mp4'))
s=s.replace('%%CORRECT%%',du(E+'Otvlekashki/correct.wav','audio/wav'))
s=s.replace('%%STARSND%%',du(E+'Otvlekashki/stage complete.wav','audio/wav'))
s=s.replace('%%PRAISE%%',du(E+'sofia-game-image/Rock3.m4a','audio/mp4'))
im=Image.open(E+'sofia-game2/Starsystems.png');im.thumbnail((256,256));b=io.BytesIO();im.save(b,'PNG',optimize=True)
s=s.replace('%%STARPNG%%','data:image/png;base64,'+base64.b64encode(b.getvalue()).decode())
import re
for k in re.findall(r'%%([A-Z0-9]+)%%',s): s=s.replace('%%'+k+'%%','')
# голос — встроенный
vd={}
for k in ["i1","i2","i3","i4","zhar","dozhd","sneg","osen","sport","prazd","bass","son","kuh","vel","og","fut","d","m"]:
    p=R+k+'.m4a'
    if os.path.exists(p): vd[k]=du(p,'audio/mp4')
import json
s=s.replace('a.src=VBASE+k+".m4a";VOICE[k]=a});','if(VDATA[k])a.src=blobUrl(VDATA[k]);VOICE[k]=a});')
s=s.replace('var VBASE="https://cdn.jsdelivr.net/gh/pandora28546-lab/wardrobe@main/w2/",VOICE={};','var VDATA='+json.dumps(vd)+',VOICE={};')
assert 'VDATA[k]' in s
open(out,'w').write(s);print(len(s)//1024,'KB')
