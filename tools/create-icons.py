from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import urllib.request,re,json,collections
root=Path(__file__).resolve().parents[1]
logo=Image.open(root/'assets/ak-logo.png').convert('RGBA')
samples=[v[:3] for v in logo.resize((300,300)).get_flattened_data() if v[3]>220]
quant=Image.new('RGB',(len(samples),1));quant.putdata(samples);quant=quant.quantize(colors=8)
palette=[{'count':n,'hex':'#'+''.join(f'{c:02x}' for c in quant.getpalette()[i*3:i*3+3])} for n,i in sorted(quant.getcolors(),reverse=True)]
(root/'qa/palette.json').write_text(json.dumps({'method':'8-color median-cut quantization; alpha > 220; 300px sample','dominant':palette,'goldHighlight':'#f8d090','bronzeAccessibleVariant':'#78501e','silver':'#d5d0c9'},indent=2))
for size in [16,32,180,192,512]:
    icon=Image.new('RGBA',(size,size),'#141413');mark=logo.copy();mark.thumbnail((round(size*.91),round(size*.91)),Image.Resampling.LANCZOS);icon.alpha_composite(mark,((size-mark.width)//2,(size-mark.height)//2));icon.convert('RGB').save(root/f'assets/logo-{size}.png')
Image.open(root/'assets/logo-512.png').save(root/'assets/favicon.ico',sizes=[(16,16),(32,32),(48,48)])
og=Image.new('RGB',(1200,630),'#141413');draw=ImageDraw.Draw(og);draw.line((70,80,1130,80),fill='#44413a',width=2);draw.line((70,550,1130,550),fill='#44413a',width=2)
mark=logo.copy();mark.thumbnail((340,360),Image.Resampling.LANCZOS);og.paste(mark,(785,135),mark)
def font(size,bold=False):return ImageFont.truetype('C:/Windows/Fonts/'+('arialbd.ttf' if bold else 'arial.ttf'),size)
draw.text((70,140),'ADNAN KAFRI',font=font(61,True),fill='#f2eee6');draw.text((74,235),'Laravel & backend development',font=font(31),fill='#f8d090');draw.text((74,288),'AI integration · IT support',font=font(29),fill='#d5d0c9');draw.text((74,455),'HAMA, SYRIA  /  AVAILABLE REMOTELY',font=font(21),fill='#b6b1a7');og.save(root/'assets/og-image.png',optimize=True)

for size in [112,192]:
    Image.open(root/'assets/logo-192.png').resize((size,size),Image.Resampling.LANCZOS).save(root/f'assets/logo-{size}.webp',quality=90)
