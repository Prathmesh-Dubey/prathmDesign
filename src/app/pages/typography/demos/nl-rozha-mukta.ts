import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { loadGoogleFonts } from '../../../shared/fonts';

type Lang = 'en' | 'hi';
interface Copy {
  issue: string; title: string; intro: string;
  recipeH: string; recipeT: string; recipeP: string; ingredients: string[];
  marketH: string; marketP: string; storyH: string; storyP: string;
  subH: string; subP: string; btn: string; ok: string;
}

const COPY: Record<Lang, Copy> = {
  en: {
    issue: 'Issue 64 · Thursday, 15 October',
    title: 'Pickle season is here',
    intro: 'Every Thursday from a small kitchen in Pune: one recipe, one market, and one story from somebody’s grandmother.',
    recipeH: 'This week’s recipe', recipeT: 'Raw mango & mustard pickle',
    recipeP: 'Cut the mangoes the night before so they dry a little. The oil should be smoking hot, then completely cool, before it touches the spices.',
    ingredients: ['1 kg raw mangoes, cubed', '½ cup split mustard seeds', '2 tbsp Kashmiri chilli powder', '1 tsp fenugreek, lightly roasted', '¾ cup cold-pressed mustard oil'],
    marketH: 'Market of the week', marketP: 'Mahatma Phule Mandai opens at six. Go to the back corner for the raw mangoes; the stall with the blue tarp weighs honestly.',
    storyH: 'Ajji’s brass jar', storyP: 'My grandmother never measured salt. She tasted, frowned, and added “a little more”. The jar she used is sixty years old and still lives on my top shelf.',
    subH: 'Join 8,200 readers', subP: 'Free, weekly, in English and Hindi.', btn: 'Subscribe', ok: 'Thank you — see you on Thursday.',
  },
  hi: {
    issue: 'अंक 64 · गुरुवार, 15 अक्टूबर',
    title: 'अचार का मौसम आ गया',
    intro: 'हर गुरुवार, पुणे की एक छोटी रसोई से: एक रेसिपी, एक बाज़ार, और किसी की दादी की एक कहानी।',
    recipeH: 'इस हफ़्ते की रेसिपी', recipeT: 'कच्चे आम और राई का अचार',
    recipeP: 'आम एक रात पहले काट लें ताकि वे थोड़े सूख जाएँ। तेल को धुआँ आने तक गरम करें, फिर पूरी तरह ठंडा होने दें, उसके बाद ही मसालों में डालें।',
    ingredients: ['1 किलो कच्चे आम, टुकड़ों में', '½ कप राई की दाल', '2 बड़े चम्मच कश्मीरी लाल मिर्च', '1 छोटा चम्मच मेथी, हल्की भुनी', '¾ कप सरसों का तेल'],
    marketH: 'इस हफ़्ते का बाज़ार', marketP: 'महात्मा फुले मंडई सुबह छह बजे खुलती है। कच्चे आम के लिए पीछे वाले कोने में जाइए; नीली तिरपाल वाली दुकान ईमानदारी से तौलती है।',
    storyH: 'अज्जी का पीतल का मर्तबान', storyP: 'मेरी दादी नमक कभी नापती नहीं थीं। वे चखतीं, माथा सिकोड़तीं, और कहतीं “थोड़ा और”। उनका साठ साल पुराना मर्तबान आज भी मेरी ऊपर वाली शेल्फ़ पर है।',
    subH: '8,200 पाठकों से जुड़ें', subP: 'मुफ़्त, साप्ताहिक, हिंदी और अंग्रेज़ी में।', btn: 'सदस्यता लें', ok: 'धन्यवाद — गुरुवार को मिलते हैं।',
  },
};

@Component({
  selector: 'demo-nl-rozha-mukta',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="scroll">
      <div class="paper" [attr.lang]="lang()">
        <header class="mast">
          <div class="row">
            <p class="logo">Tiffin Notes <span lang="hi">टिफ़िन नोट्स</span></p>
            <div class="lang" role="group" aria-label="Language">
              <button type="button" [class.on]="lang() === 'en'" [attr.aria-pressed]="lang() === 'en'" (click)="lang.set('en')">EN</button>
              <button type="button" [class.on]="lang() === 'hi'" [attr.aria-pressed]="lang() === 'hi'" (click)="lang.set('hi')" lang="hi">हिं</button>
            </div>
          </div>
          <p class="issue">{{ c().issue }}</p>
        </header>

        <div class="content">
          <h1>{{ c().title }}</h1>
          <p class="intro">{{ c().intro }}</p>

          <section class="recipe">
            <p class="lbl">{{ c().recipeH }}</p>
            <h2>{{ c().recipeT }}</h2>
            <ul>
              @for (i of c().ingredients; track $index) { <li>{{ i }}</li> }
            </ul>
            <p>{{ c().recipeP }}</p>
          </section>

          <div class="two">
            <section><p class="lbl">{{ c().marketH }}</p><p>{{ c().marketP }}</p></section>
            <section><h3>{{ c().storyH }}</h3><p>{{ c().storyP }}</p></section>
          </div>

          <section class="sub">
            @if (joined()) {
              <p class="ok">{{ c().ok }}</p>
            } @else {
              <div><h3>{{ c().subH }}</h3><p>{{ c().subP }}</p></div>
              <button type="button" (click)="joined.set(true)">{{ c().btn }}</button>
            }
          </section>
        </div>

        <footer class="key" aria-label="Type specimen">
          <div><span class="kr">Rozha One</span><span class="kr" lang="hi">रोझा वन</span><small>Latin + Devanagari display · 400</small></div>
          <div><span class="kmu">Mukta</span><span class="kmu" lang="hi">मुक्ता</span><small>Text 400 / 600 / 800 · 16 / 28 px, taller leading for Hindi</small></div>
        </footer>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; position: relative; min-height: 680px; background: #0f4c5c; color: #1b2a2f; container-type: inline-size; }
    .scroll { position: absolute; inset: 0; overflow: auto; padding: clamp(12px, 3cqi, 28px) 12px; }
    .paper { max-width: 660px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; }
    .mast { background: #f2a900; padding: 18px clamp(18px, 5cqi, 36px) 14px; position: relative; }
    .mast::after { content: ''; position: absolute; left: 0; right: 0; bottom: -9px; height: 10px; background: radial-gradient(circle at 10px -2px, #f2a900 9px, transparent 10px) 0 0 / 20px 10px repeat-x; }
    .row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .logo { font: 400 clamp(26px, 5cqi, 36px)/1.1 'Rozha One', serif; color: #0f4c5c; }
    .logo span { font-size: .62em; color: #7a3e00; margin-left: 6px; }
    .lang { display: inline-flex; background: rgba(15,76,92,.12); border-radius: 999px; padding: 3px; }
    .lang button { font: 800 13px/1 'Mukta', sans-serif; border: 0; background: transparent; color: #0f4c5c; padding: 7px 11px; border-radius: 999px; cursor: pointer; }
    .lang button.on { background: #0f4c5c; color: #fff; }
    .issue { font: 600 13px/1.4 'Mukta', sans-serif; color: #5a3a00; margin-top: 6px; }
    .content { padding: 30px clamp(18px, 5cqi, 36px) 10px; animation: fade .4s ease-out; }
    h1 { font: 400 clamp(36px, 7cqi, 60px)/1.1 'Rozha One', serif; color: #0f4c5c; text-wrap: balance; }
    [lang='hi'] h1 { line-height: 1.3; }
    .intro { font: 400 17px/1.65 'Mukta', sans-serif; color: #3d4d52; margin-top: 12px; max-width: 54ch; }
    [lang='hi'] .intro, [lang='hi'] .content p { line-height: 1.85; }
    .lbl { font: 800 12.5px/1.2 'Mukta', sans-serif; color: #b35c00; }
    .recipe { margin-top: 24px; padding: 20px; border-radius: 10px; background: #fff3d1; }
    h2 { font: 400 clamp(24px, 4cqi, 32px)/1.25 'Rozha One', serif; color: #0f4c5c; margin-top: 4px; }
    .recipe ul { margin: 12px 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 6px 18px; font: 600 15px/1.45 'Mukta', sans-serif; }
    .recipe li { padding-left: 16px; position: relative; }
    .recipe li::before { content: ''; position: absolute; left: 0; top: .55em; width: 7px; height: 7px; border-radius: 50%; background: #f2a900; }
    .content p { font: 400 16px/1.7 'Mukta', sans-serif; text-wrap: pretty; }
    .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; margin-top: 22px; }
    .two section { border-top: 3px solid #0f4c5c; padding-top: 12px; }
    h3 { font: 400 22px/1.3 'Rozha One', serif; color: #0f4c5c; }
    .sub { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-top: 24px; padding: 18px 20px; border-radius: 10px; background: #0f4c5c; color: #fff; }
    .sub h3 { color: #f2a900; }
    .sub p { color: #cfe1e5; font-size: 14.5px !important; }
    .sub button { font: 800 15px/1 'Mukta', sans-serif; background: #f2a900; color: #0f4c5c; border: 0; border-radius: 999px; padding: 12px 20px; cursor: pointer; }
    .ok { font: 400 20px/1.4 'Rozha One', serif !important; color: #f2a900; }
    .key { display: flex; flex-wrap: wrap; gap: 14px 30px; margin: 24px clamp(18px, 5cqi, 36px) 0; padding: 14px 0 24px; border-top: 1px solid #e8e1cf; }
    .key div { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: baseline; }
    .key small { flex-basis: 100%; font: 400 12px/1.3 'Mukta', sans-serif; color: #6a777b; }
    .kr { font: 400 22px/1.3 'Rozha One', serif; color: #0f4c5c; }
    .kmu { font: 600 19px/1.3 'Mukta', sans-serif; color: #0f4c5c; }
    .lang button, .sub button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    .lang button:not(.on):active { background: rgba(15,76,92,.18); }
    .sub button:active { transform: scale(.96); }
    @media (pointer: coarse) { .lang button { min-height: 38px; min-width: 44px; } .sub button { min-height: 44px; } }
    @container (max-width: 400px) { .logo span { display: block; margin-left: 0; } .row { align-items: flex-start; } }
    @keyframes fade { from { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .content { animation: none; } }
  `,
})
export class NlRozhaMukta {
  protected readonly lang = signal<Lang>('en');
  protected readonly joined = signal(false);
  protected readonly c = computed(() => COPY[this.lang()]);

  constructor() {
    loadGoogleFonts('Rozha+One', 'Mukta:wght@400;600;800');
  }
}
