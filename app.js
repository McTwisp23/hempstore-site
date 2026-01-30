/* =========================
   HEMP Store - app.js (FULL)
   - i18n (PT/EN/IT/FR/DE/ES/ZH)
   - Language wheel (iPhone style) + flags
   - Featured products render
   - Products catalog (categories + variants)
   - Cart + Checkout + Login (demo)
========================= */

/* ---------- Languages ---------- */
const LANGS = [
  { code:"pt", flag:"🇧🇷", name:"Português", meta:"Brasil" },
  { code:"en", flag:"🇺🇸", name:"English", meta:"United States" },
  { code:"fr", flag:"🇫🇷", name:"Français", meta:"France" },
  { code:"it", flag:"🇮🇹", name:"Italiano", meta:"Italia" },
  { code:"es", flag:"🇪🇸", name:"Español", meta:"España" },
  { code:"de", flag:"🇩🇪", name:"Deutsch", meta:"Deutschland" },
  { code:"ja", flag:"🇯🇵", name:"日本語", meta:"日本" },
  { code:"zh", flag:"🇨🇳", name:"中文", meta:"简体" },
];
  
  /* ---------- Storage ---------- */
  const LS = {
    langKey: "hemp_lang",
    userKey: "hemp_user",
    cartKey: "hemp_cart",
    orderKey:"hemp_last_order",
    tokenKey:"hemp_token",
    apiKey:"hemp_api",
  };
  
  function getLang(){
    const stored = (localStorage.getItem(LS.langKey) || "pt").toLowerCase();
    return LANGS.some(l=>l.code===stored) ? stored : "pt";
  }
  function setLang(code){ localStorage.setItem(LS.langKey, code); }
  function getUser(){ try { return JSON.parse(localStorage.getItem(LS.userKey) || "null"); } catch { return null; } }
  function setUser(user){ localStorage.setItem(LS.userKey, JSON.stringify(user)); }
  function logout(){ localStorage.removeItem(LS.userKey); localStorage.removeItem(LS.tokenKey); location.href = "index.html"; }
  
  function getCart(){ try { return JSON.parse(localStorage.getItem(LS.cartKey) || "[]"); } catch { return []; } }
  function setCart(cart){ localStorage.setItem(LS.cartKey, JSON.stringify(cart)); updateCartBadge(); }
  function cartCount(){ return getCart().reduce((sum,i)=>sum + i.qty, 0); }
  
  
  /* ---------- API (localhost default) ---------- */
  function getApiBase(){
    const q = new URLSearchParams(location.search);
    const fromQuery = q.get("api");
    if(fromQuery){
      const clean = String(fromQuery).replace(/\/$/, "");
      localStorage.setItem(LS.apiKey, clean);
      return clean;
    }
    const stored = localStorage.getItem(LS.apiKey);
    return String(stored || "http://localhost:3001").replace(/\/$/, "");
  }
  function getToken(){ return localStorage.getItem(LS.tokenKey) || ""; }
  function setToken(tok){
    if(tok) localStorage.setItem(LS.tokenKey, tok);
    else localStorage.removeItem(LS.tokenKey);
  }

  async function apiFetch(path, opts={}){
    const url = getApiBase() + path;
    const headers = Object.assign({ "Content-Type":"application/json" }, (opts.headers||{}));
    const tok = getToken();
    if(tok) headers["Authorization"] = "Bearer " + tok;
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    let data = null;
    const ct = res.headers.get("content-type") || "";
    if(ct.includes("application/json")){
      try{ data = await res.json(); }catch{ data = null; }
    } else {
      try{ data = await res.text(); }catch{ data = null; }
    }
    if(!res.ok){
      const msg = (data && data.error) ? data.error : `HTTP ${res.status}`;
      const err = new Error(msg);
      // @ts-ignore
      err.status = res.status;
      // @ts-ignore
      err.data = data;
      throw err;
    }
    return data;
  }

  function setAuthSession(payload){
    // payload: { token, user }
    if(payload?.token) setToken(payload.token);
    if(payload?.user) setUser(payload.user);
  }

/* ---------- i18n dictionary ---------- */
  const I18N = {
    pt: {
      home:"Home", products:"Produtos", about:"Sobre", contact:"Contato",
      cart:"Carrinho", checkout:"Checkout", login:"Login",
      my_orders:"Minhas compras",
      language:"Idioma", ok:"OK",
      hero_title:"Lifestyle canábico",
      hero_sub:"Produtos premium à base de cânhamo. Design, bem-estar e sustentabilidade em um só lugar.",
      hero_image_label:"Imagem do produto",
      see_products:"Ver produtos",
      featured:"Produtos em Destaque",
      search_ph:"Buscar produtos…",
      all_categories:"Todas categorias",
      cat_oils:"Óleos",
      cat_strains:"Strains",
      cat_cigars:"Charutaria",
      cat_gummies:"Gomas",
      cat_extracts:"Extrações",
      cat_drinks:"Bebidas",
      cat_accessories:"Acessórios",
      cat_beverages:"Bebidas",
      cat_vapes:"Vapes",
      cat_pets:"Pets",
      cat_edibles:"Comestíveis",
  
      back:"← Voltar para Produtos",
      product_page:"Página de Produto",
      choose:"Escolha as opções",
      choose_volume_strain:"Escolha volume e variedade",
      your_config:"Sua configuração",
      desc:"Descrição",
      add_cart:"Adicionar ao carrinho",
      view_cart:"Ver carrinho",
      continue:"Continuar comprando",
  
      sign_in:"Entrar",
      sign_out:"Sair",
      email:"E-mail",
      password:"Senha",
      create_demo:"(Conta real) Use seu e-mail e senha (mín. 8 caracteres)",
  
      empty_cart:"Seu carrinho está vazio.",
      item:"Item",
      price:"Preço",
      qty:"Quantidade",
      remove:"Remover",
      subtotal:"Subtotal",
      shipping:"Frete",
      tax:"Impostos",
      total:"Total",
      go_checkout:"Ir para checkout",
  
      checkout_title:"Checkout detalhado",
      step1:"Dados do cliente",
      step2:"Endereço de entrega",
      step3:"Frete",
      step4:"Pagamento",
      step5:"Resumo",
      first:"Nome", last:"Sobrenome", phone:"Telefone",
      doc:"CPF/CNPJ",
      address1:"Rua e número", address2:"Complemento",
      city:"Cidade", state:"Estado", zip:"CEP", country:"País",
      shipping_method:"Método de frete",
      ship_std:"Padrão (3–7 dias)",
      ship_exp:"Expresso (1–3 dias)",
      pay_method:"Método de pagamento",
      pay_pix:"PIX",
      pay_boleto:"Boleto",
      pay_ted:"TED",
      pay_doc:"DOC",
      pay_btc:"Bitcoin (Lightning)",
      pay_hint_btc:"Você paga como preferir — a Hemp Store recebe em BTC via Lightning.",
      pay_hint_fiat:"Pagamentos em reais (PIX/Boleto/TED/DOC) ficam como \"aguardando\" até a compensação.",
      invoice_title:"Pagamento em BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copiar invoice",
      invoice_copied:"Copiado!",
      open_wallet:"Abrir na carteira",
      fiat_title:"Instruções do pagamento em reais",
      fiat_pix_key:"Chave PIX",
      fiat_pix_payload:"Copia e cola",
      fiat_boleto_code:"Código do boleto",
      fiat_bank_title:"Dados bancários",
      fiat_bank_name:"Banco",
      fiat_agency:"Agência",
      fiat_account:"Conta",
      fiat_holder:"Favorecido",
      fiat_cnpj:"CPF/CNPJ",
      place_order:"Gerar cobrança",
      order_ok:"Cobrança gerada! (demo)",
      checkout_terms:"Ao finalizar, você concorda com os termos (demo).",
  
      // product option labels
      opt_type:"Tipo",
      opt_profile:"Perfil",
      opt_cannabinoid:"Cannabinoide",
      opt_size:"Tamanho",
      opt_flavor:"Sabor",
      opt_puffs:"Puxadas",
      opt_ice:"Gelo",
      opt_variety:"Variedade",
      opt_weight:"Peso",
      opt_ml:"ML",
      opt_strain:"Strain",
      opt_strength:"Potência",
      opt_format:"Formato",
      opt_spectrum:"Espectro",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Unidades",
  
      // medical-style friendly disclaimer
      med_note_title:"Nota (bem de boa):",
      med_note:"Cannabinoides e terpenos podem apoiar relaxamento, sono, apetite e bem-estar em algumas pessoas — mas cada corpo é um corpo. Isso aqui é conteúdo informativo, não substitui orientação médica. Se você usa remédios, está grávida(o) ou tem alguma condição, converse com um profissional.",
      pay_debit:"Débito",
      pay_credit:"Crédito",
      pay_hint_card:"Pagamento por cartão (débito/crédito). (demo) Em produção, processe via adquirente/gateway e só libere após confirmação.",
      checkout_receive_ln:"A Hemp Store recebe em BTC via Lightning.",
      order_summary:"Revise seu pedido",
      card_name:"Nome no cartão",
      card_name_ph:"Como no cartão",
      card_number:"Número do cartão",
      card_exp:"Validade",
      card_cvv:"CVV",
      card_installments:"Parcelamento",
      company:"Empresa",
      footer_nav:"Navegação",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Enter para buscar no catálogo.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Receba novidades e lançamentos (demo).",
      subscribe:"Inscrever",
      email_placeholder:"seuemail@exemplo.com",
      terms:"Termos",
      privacy:"Privacidade",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Produtos premium à base de cânhamo. Bem-estar, design e sustentabilidade.",
      footer_desc_hoc:"P&D, qualidade e supply chain para o mercado regulado.",
      newsletter_success:"Cadastro recebido! (demo)",
      newsletter_invalid:"Digite um e-mail válido.",
      cannabinoids_title:"Principais canabinoides",
      cannabinoids_sub:"Saiba mais sobre canabinoides comuns em produtos à base de cânhamo (conteúdo informativo).",
      cann_label_props:"Propriedades comuns:",
      cann_label_studied:"Estudado para:",
      cann_cbd_title:"CBD (Canabidiol)",
      cann_cbd_props:"Possível ação anti-inflamatória*, ansiolítica* e analgésica*.",
      cann_cbd_studied:"Bem-estar, relaxamento, sono e conforto — a evidência varia por condição e produto.",
      cann_cbd_more:"CBD é geralmente não intoxicante e aparece em óleos, gomas e produtos pet. Leia rótulos e verifique conformidade local.",
      cann_thc_title:"THC (Tetrahidrocanabinol)",
      cann_thc_props:"Pode ser euforizante*, analgésico* e antiemético*.",
      cann_thc_studied:"Dor, náusea e apetite — somente onde permitido; a evidência varia.",
      cann_thc_more:"THC é regulado e pode ser intoxicante. Use apenas onde permitido e com responsabilidade.",
      cann_cbg_title:"CBG (Canabigerol)",
      cann_cbg_props:"Possível ação anti-inflamatória* e antioxidante* (evidência ainda emergente).",
      cann_cbg_studied:"Suporte de bem-estar e inflamação — evidência ainda preliminar.",
      cann_cbg_more:"CBG é menos comum e costuma aparecer em fórmulas específicas (isolado ou blend).",
      learn_more:"Saiba mais",
      cann_note:"*Efeitos variam. Este conteúdo é educativo e não substitui orientação médica."

    },
  
    en: {
      home:"Home", products:"Products", about:"About", contact:"Contact",
      cart:"Cart", checkout:"Checkout", login:"Login",
      my_orders:"My orders",
      language:"Language", ok:"OK",
      hero_title:"Cannabis lifestyle",
      hero_sub:"Premium hemp-based products. Design, wellness and sustainability in one place.",
      hero_image_label:"Product image",
      see_products:"See products",
      featured:"Featured Products",
      search_ph:"Search products…",
      all_categories:"All categories",
      cat_oils:"Oils",
      cat_strains:"Strains",
      cat_cigars:"Cigars & pre-rolls",
      cat_gummies:"Gummies",
      cat_extracts:"Extracts",
      cat_drinks:"Drinks",
      cat_accessories:"Accessories",
      cat_beverages:"Beverages",
      cat_vapes:"Vapes",
      cat_pets:"Pets",
      cat_edibles:"Edibles",
  
      back:"← Back to Products",
      product_page:"Product Page",
      choose:"Choose options",
      choose_volume_strain:"Choose volume and variety",
      your_config:"Your configuration",
      desc:"Description",
      add_cart:"Add to cart",
      view_cart:"View cart",
      continue:"Continue shopping",
  
      sign_in:"Sign in",
      sign_out:"Sign out",
      email:"Email",
      password:"Password",
      create_demo:"(Demo) Use any email/password",
  
      empty_cart:"Your cart is empty.",
      item:"Item",
      price:"Price",
      qty:"Quantity",
      remove:"Remove",
      subtotal:"Subtotal",
      shipping:"Shipping",
      tax:"Tax",
      total:"Total",
      go_checkout:"Go to checkout",
  
      checkout_title:"Detailed checkout",
      step1:"Customer details",
      step2:"Shipping address",
      step3:"Shipping",
      step4:"Payment",
      step5:"Summary",
      first:"First name", last:"Last name", phone:"Phone",
      doc:"ID / Tax number",
      address1:"Street and number", address2:"Apt / Suite",
      city:"City", state:"State", zip:"ZIP", country:"Country",
      shipping_method:"Shipping method",
      ship_std:"Standard (3–7 days)",
      ship_exp:"Express (1–3 days)",
      pay_method:"Payment method",
      pay_card:"Card",
      pay_pix:"PIX",
      card_name:"Name on card",
      card_number:"Card number",
      card_exp:"Expiry (MM/YY)",
      card_cvv:"CVV",
      pix_note:"PIX key will be generated at place order (demo).",
      place_order:"Place order",
      order_ok:"Order placed (demo)! Thank you.",
      checkout_terms:"By placing the order, you agree to the terms (demo).",
  
      opt_type:"Type",
      opt_profile:"Profile",
      opt_cannabinoid:"Cannabinoid",
      opt_size:"Size",
      opt_flavor:"Flavor",
      opt_puffs:"Puffs",
      opt_ice:"Ice",
      opt_variety:"Variety",
      opt_weight:"Weight",
      opt_ml:"ML",
      opt_strain:"Strain",
      opt_strength:"Strength",
      opt_format:"Format",
      opt_spectrum:"Spectrum",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Units",
  
      med_note_title:"Friendly note:",
      med_note:"Cannabinoids and terpenes may support relaxation, sleep, appetite and wellness for some people — but everyone’s different. This is informational content, not medical advice. If you take meds, are pregnant, or have a condition, talk to a professional.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Bank transfer (TED)",
      pay_doc:"Bank transfer (DOC)",
      pay_debit:"Debit",
      pay_credit:"Credit",
      pay_hint_btc:"Pay however you want — Hemp Store receives BTC via Lightning.",
      pay_hint_fiat:"BRL payments (PIX/Boleto/TED/DOC) stay as pending until cleared.",
      pay_hint_card:"Card payment (debit/credit). (demo) In production, process via your acquirer/gateway and only release after confirmation.",
      invoice_title:"BTC payment (Lightning)",
      invoice_label:"Lightning invoice",
      invoice_copy:"Copy invoice",
      invoice_copied:"Copied!",
      open_wallet:"Open wallet",
      fiat_title:"BRL payment instructions",
      fiat_pix_key:"PIX key",
      fiat_pix_payload:"Copy & paste",
      fiat_boleto_code:"Boleto code",
      fiat_bank_name:"Bank",
      fiat_agency:"Branch",
      fiat_account:"Account",
      fiat_holder:"Account holder",
      fiat_cnpj:"Tax ID",
      checkout_receive_ln:"Hemp Store receives BTC via Lightning.",
      order_summary:"Review your order",
      card_name_ph:"As on card",
      card_installments:"Installments",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Press Enter to search the catalog.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Key cannabinoids",
      cannabinoids_sub:"Learn about common cannabinoids found in hemp-based products (informational only).",
      cann_label_props:"Common properties:",
      cann_label_studied:"Studied for:",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Potential anti-inflammatory*, calming* and analgesic* effects.",
      cann_cbd_studied:"Well-being, relaxation, sleep and comfort — evidence varies by condition and product.",
      cann_cbd_more:"CBD is generally non-intoxicating and appears in oils, gummies and pet products. Check labels and local compliance.",
      cann_thc_title:"THC (Tetrahydrocannabinol)",
      cann_thc_props:"May be euphoric*, analgesic* and antiemetic*.",
      cann_thc_studied:"Pain, nausea and appetite — where permitted; evidence varies.",
      cann_thc_more:"THC is regulated and can be intoxicating. Use only where permitted and responsibly.",
      cann_cbg_title:"CBG (Cannabigerol)",
      cann_cbg_props:"Potential anti-inflammatory* and antioxidant* activity (early evidence).",
      cann_cbg_studied:"Wellness support and inflammation — evidence is still preliminary.",
      cann_cbg_more:"CBG is less common and often appears in targeted formulas (isolates or blends).",
      learn_more:"Learn more",
      cann_note:"*Effects vary. Educational content; not medical advice."

    },
  
    it: {
      home:"Home", products:"Prodotti", about:"Chi siamo", contact:"Contatto",
      cart:"Carrello", checkout:"Checkout", login:"Login",
      my_orders:"I miei ordini",
      language:"Lingua", ok:"OK",
      hero_title:"Lifestyle cannabico",
      hero_sub:"Prodotti premium a base di canapa. Design, benessere e sostenibilità in un unico posto.",
      hero_image_label:"Immagine del prodotto",
      see_products:"Vedi prodotti",
      featured:"Prodotti in evidenza",
      search_ph:"Cerca prodotti…",
      all_categories:"Tutte le categorie",
      cat_oils:"Oli",
      cat_strains:"Strains",
      cat_cigars:"Sigari & pre-roll",
      cat_gummies:"Caramelle",
      cat_extracts:"Estratti",
      cat_drinks:"Bevande",
      cat_accessories:"Accessori",
      cat_beverages:"Bevande",
      cat_vapes:"Vape",
      cat_pets:"Animali",
      cat_edibles:"Edibili",
  
      back:"← Torna ai Prodotti",
      product_page:"Pagina Prodotto",
      choose:"Scegli le opzioni",
      choose_volume_strain:"Scegli volume e varietà",
      your_config:"La tua configurazione",
      desc:"Descrizione",
      add_cart:"Aggiungi al carrello",
      view_cart:"Vedi carrello",
      continue:"Continua lo shopping",
  
      sign_in:"Accedi",
      sign_out:"Esci",
      email:"Email",
      password:"Password",
      create_demo:"(Demo) Usa qualsiasi email/password",
  
      empty_cart:"Il carrello è vuoto.",
      item:"Articolo",
      price:"Prezzo",
      qty:"Quantità",
      remove:"Rimuovi",
      subtotal:"Subtotale",
      shipping:"Spedizione",
      tax:"Tasse",
      total:"Totale",
      go_checkout:"Vai al checkout",
  
      checkout_title:"Checkout dettagliato",
      step1:"Dati cliente",
      step2:"Indirizzo di consegna",
      step3:"Spedizione",
      step4:"Pagamento",
      step5:"Riepilogo",
      first:"Nome", last:"Cognome", phone:"Telefono",
      doc:"ID / Codice fiscale",
      address1:"Via e numero", address2:"Interno",
      city:"Città", state:"Provincia", zip:"CAP", country:"Paese",
      shipping_method:"Metodo di spedizione",
      ship_std:"Standard (3–7 giorni)",
      ship_exp:"Espresso (1–3 giorni)",
      pay_method:"Metodo di pagamento",
      pay_card:"Carta",
      pay_pix:"PIX",
      card_name:"Nome sulla carta",
      card_number:"Numero carta",
      card_exp:"Scadenza (MM/AA)",
      card_cvv:"CVV",
      pix_note:"La chiave PIX verrà generata al termine (demo).",
      place_order:"Conferma ordine",
      order_ok:"Ordine confermato (demo)! Grazie.",
      checkout_terms:"Confermando, accetti i termini (demo).",
  
      opt_type:"Tipo",
      opt_profile:"Profilo",
      opt_cannabinoid:"Cannabinoide",
      opt_size:"Dimensione",
      opt_flavor:"Gusto",
      opt_puffs:"Tiri",
      opt_ice:"Ghiaccio",
      opt_strain:"Strain",
      opt_strength:"Potenza",
      opt_format:"Formato",
      opt_spectrum:"Spettro",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Unità",
  
      med_note_title:"Nota (tranquilla):",
      med_note:"Cannabinoidi e terpeni possono supportare relax, sonno e benessere in alcune persone — ma ognuno è diverso. Informativo, non è consiglio medico.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Bonifico (TED)",
      pay_doc:"Bonifico (DOC)",
      pay_debit:"Debito",
      pay_credit:"Credito",
      pay_hint_btc:"Paga come preferisci — Hemp Store riceve BTC via Lightning.",
      pay_hint_fiat:"Pagamenti in BRL (PIX/Boleto/TED/DOC) restano in attesa fino alla compensazione.",
      pay_hint_card:"Pagamento con carta (debito/credito). (demo) In produzione, elabora tramite acquirer/gateway e rilascia solo dopo conferma.",
      invoice_title:"Pagamento in BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copia invoice",
      invoice_copied:"Copiato!",
      open_wallet:"Apri wallet",
      fiat_title:"Istruzioni pagamento in BRL",
      fiat_pix_key:"Chiave PIX",
      fiat_pix_payload:"Copia e incolla",
      fiat_boleto_code:"Codice boleto",
      fiat_bank_name:"Banca",
      fiat_agency:"Filiale",
      fiat_account:"Conto",
      fiat_holder:"Intestatario",
      fiat_cnpj:"ID fiscale",
      checkout_receive_ln:"Hemp Store riceve BTC via Lightning.",
      order_summary:"Riepilogo ordine",
      card_name_ph:"Come sulla carta",
      card_installments:"Rate",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Premi Invio per cercare nel catalogo.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Cannabinoidi principali",
      cannabinoids_sub:"Scopri cannabinoidi comuni nei prodotti a base di canapa (solo informativo).",
      cann_label_props:"Proprietà comuni:",
      cann_label_studied:"Studiato per:",
      cann_cbd_title:"CBD (Cannabidiolo)",
      cann_cbd_props:"Possibili effetti antinfiammatori*, calmanti* e analgesici*.",
      cann_cbd_studied:"Benessere, relax, sonno e comfort — l’evidenza varia.",
      cann_cbd_more:"Il CBD è generalmente non inebriante e si trova in oli, caramelle/gummies e prodotti per animali. Controlla etichette e conformità locale.",
      cann_thc_title:"THC (Tetraidrocannabinolo)",
      cann_thc_props:"Può essere euforizzante*, analgesico* e antiemetico*.",
      cann_thc_studied:"Dolore, nausea e appetito — solo dove consentito; evidenza variabile.",
      cann_thc_more:"Il THC è regolamentato e può essere inebriante. Usalo solo dove consentito e con responsabilità.",
      cann_cbg_title:"CBG (Cannabigerolo)",
      cann_cbg_props:"Possibile attività antinfiammatoria* e antiossidante* (evidenza iniziale).",
      cann_cbg_studied:"Supporto al benessere e infiammazione — evidenza preliminare.",
      cann_cbg_more:"Il CBG è meno comune e spesso appare in formule mirate (isolati o mix).",
      learn_more:"Scopri di più",
      cann_note:"*Gli effetti variano. Contenuto educativo; non è un consiglio medico."

    },
  
    fr: {
      home:"Accueil", products:"Produits", about:"À propos", contact:"Contact",
      cart:"Panier", checkout:"Paiement", login:"Connexion",
      my_orders:"Mes achats",
      language:"Langue", ok:"OK",
      hero_title:"Lifestyle cannabique",
      hero_sub:"Produits premium à base de chanvre. Design, bien-être et durabilité au même endroit.",
      hero_image_label:"Image du produit",
      see_products:"Voir les produits",
      featured:"Produits en vedette",
      search_ph:"Rechercher…",
      all_categories:"Toutes catégories",
      cat_oils:"Huiles",
      cat_strains:"Strains",
      cat_cigars:"Cigares & pré-roulés",
      cat_gummies:"Gommes",
      cat_extracts:"Extraits",
      cat_drinks:"Boissons",
      cat_accessories:"Accessoires",
      cat_beverages:"Boissons",
      cat_vapes:"Vapes",
      cat_pets:"Animaux",
      cat_edibles:"Comestibles",
  
      back:"← Retour aux Produits",
      product_page:"Page Produit",
      choose:"Choisissez les options",
      choose_volume_strain:"Choisissez le volume et la variété",
      your_config:"Votre configuration",
      desc:"Description",
      add_cart:"Ajouter au panier",
      view_cart:"Voir le panier",
      continue:"Continuer vos achats",
  
      sign_in:"Se connecter",
      sign_out:"Se déconnecter",
      email:"Email",
      password:"Mot de passe",
      create_demo:"(Démo) Utilisez n'importe quel email/mot de passe",
  
      empty_cart:"Votre panier est vide.",
      item:"Article",
      price:"Prix",
      qty:"Quantité",
      remove:"Retirer",
      subtotal:"Sous-total",
      shipping:"Livraison",
      tax:"Taxes",
      total:"Total",
      go_checkout:"Aller au paiement",
  
      checkout_title:"Paiement détaillé",
      step1:"Infos client",
      step2:"Adresse de livraison",
      step3:"Livraison",
      step4:"Paiement",
      step5:"Résumé",
      first:"Prénom", last:"Nom", phone:"Téléphone",
      doc:"ID / N° fiscal",
      address1:"Rue et numéro", address2:"Complément",
      city:"Ville", state:"Région", zip:"Code postal", country:"Pays",
      shipping_method:"Mode de livraison",
      ship_std:"Standard (3–7 jours)",
      ship_exp:"Express (1–3 jours)",
      pay_method:"Moyen de paiement",
      pay_card:"Carte",
      pay_pix:"PIX",
      card_name:"Nom sur la carte",
      card_number:"Numéro de carte",
      card_exp:"Expiration (MM/AA)",
      card_cvv:"CVV",
      pix_note:"Clé PIX générée à la validation (démo).",
      place_order:"Valider la commande",
      order_ok:"Commande validée (démo) ! Merci.",
      checkout_terms:"En validant, vous acceptez les conditions (démo).",
  
      opt_type:"Type",
      opt_profile:"Profil",
      opt_cannabinoid:"Cannabinoïde",
      opt_size:"Taille",
      opt_flavor:"Saveur",
      opt_puffs:"Bouffées",
      opt_ice:"Glaçons",
      opt_strain:"Strain",
      opt_strength:"Puissance",
      opt_format:"Format",
      opt_spectrum:"Spectre",
      opt_mg:"MG",
      opt_dose:"Dose",
      opt_units:"Unités",
  
      med_note_title:"Petite note :",
      med_note:"Cannabinoïdes et terpènes peuvent aider le bien-être chez certains — mais chacun est différent. Info seulement, pas un avis médical.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Virement (TED)",
      pay_doc:"Virement (DOC)",
      pay_debit:"Débit",
      pay_credit:"Crédit",
      pay_hint_btc:"Payez comme vous voulez — Hemp Store reçoit du BTC via Lightning.",
      pay_hint_fiat:"Les paiements en BRL (PIX/Boleto/TED/DOC) restent en attente jusqu’à compensation.",
      pay_hint_card:"Paiement par carte (débit/crédit). (démo) En production, traitez via votre acquéreur/gateway et validez avant d’expédier.",
      invoice_title:"Paiement en BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copier l’invoice",
      invoice_copied:"Copié !",
      open_wallet:"Ouvrir le wallet",
      fiat_title:"Instructions de paiement en BRL",
      fiat_pix_key:"Clé PIX",
      fiat_pix_payload:"Copier-coller",
      fiat_boleto_code:"Code boleto",
      fiat_bank_name:"Banque",
      fiat_agency:"Agence",
      fiat_account:"Compte",
      fiat_holder:"Bénéficiaire",
      fiat_cnpj:"ID fiscal",
      checkout_receive_ln:"Hemp Store reçoit du BTC via Lightning.",
      order_summary:"Récapitulatif de commande",
      card_name_ph:"Comme sur la carte",
      card_installments:"Paiement en plusieurs fois",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Appuyez sur Entrée pour rechercher dans le catalogue.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Cannabinoïdes principaux",
      cannabinoids_sub:"Découvrez des cannabinoïdes courants dans les produits à base de chanvre (informatif uniquement).",
      cann_label_props:"Propriétés courantes :",
      cann_label_studied:"Étudié pour :",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Effets potentiellement anti-inflammatoires*, apaisants* et antalgiques*.",
      cann_cbd_studied:"Bien-être, relaxation, sommeil et confort — les preuves varient.",
      cann_cbd_more:"Le CBD est généralement non intoxicant et se trouve dans les huiles, gummies et produits pour animaux. Vérifiez l’étiquette et la conformité locale.",
      cann_thc_title:"THC (Tétrahydrocannabinol)",
      cann_thc_props:"Peut être euphorisant*, antalgique* et antiémétique*.",
      cann_thc_studied:"Douleur, nausées et appétit — seulement là où c’est autorisé; preuves variables.",
      cann_thc_more:"Le THC est réglementé et peut être intoxicant. Utilisez uniquement là où c’est autorisé et avec prudence.",
      cann_cbg_title:"CBG (Cannabigérol)",
      cann_cbg_props:"Activité potentiellement anti-inflammatoire* et antioxydante* (preuves initiales).",
      cann_cbg_studied:"Soutien du bien-être et inflammation — preuves préliminaires.",
      cann_cbg_more:"Le CBG est moins courant et apparaît souvent dans des formules ciblées (isolats ou mélanges).",
      learn_more:"En savoir plus",
      cann_note:"*Les effets varient. Contenu éducatif; pas un avis médical."

    },
  
    de: {
      home:"Start", products:"Produkte", about:"Über uns", contact:"Kontakt",
      cart:"Warenkorb", checkout:"Kasse", login:"Login",
      my_orders:"Meine Bestellungen",
      language:"Sprache", ok:"OK",
      hero_title:"Cannabis-Lifestyle",
      hero_sub:"Premium-Hanfprodukte. Design, Wohlbefinden und Nachhaltigkeit an einem Ort.",
      hero_image_label:"Produktbild",
      see_products:"Produkte ansehen",
      featured:"Highlights",
      search_ph:"Produkte suchen…",
      all_categories:"Alle Kategorien",
      cat_oils:"Öle",
      cat_strains:"Strains",
      cat_cigars:"Zigarren & Pre-Rolls",
      cat_gummies:"Gummis",
      cat_extracts:"Extrakte",
      cat_drinks:"Getränke",
      cat_accessories:"Zubehör",
      cat_beverages:"Getränke",
      cat_vapes:"Vapes",
      cat_pets:"Haustiere",
      cat_edibles:"Esswaren",
  
      back:"← Zurück zu Produkten",
      product_page:"Produktseite",
      choose:"Optionen wählen",
      choose_volume_strain:"Volumen und Variante wählen",
      your_config:"Ihre Konfiguration",
      desc:"Beschreibung",
      add_cart:"In den Warenkorb",
      view_cart:"Warenkorb ansehen",
      continue:"Weiter einkaufen",
  
      sign_in:"Anmelden",
      sign_out:"Abmelden",
      email:"E-Mail",
      password:"Passwort",
      create_demo:"(Demo) Beliebige E-Mail/Passwort verwenden",
  
      empty_cart:"Dein Warenkorb ist leer.",
      item:"Artikel",
      price:"Preis",
      qty:"Menge",
      remove:"Entfernen",
      subtotal:"Zwischensumme",
      shipping:"Versand",
      tax:"Steuern",
      total:"Gesamt",
      go_checkout:"Zur Kasse",
  
      checkout_title:"Detaillierter Checkout",
      step1:"Kundendaten",
      step2:"Lieferadresse",
      step3:"Versand",
      step4:"Zahlung",
      step5:"Zusammenfassung",
      first:"Vorname", last:"Nachname", phone:"Telefon",
      doc:"ID / Steuernummer",
      address1:"Straße und Nr.", address2:"Zusatz",
      city:"Stadt", state:"Bundesland", zip:"PLZ", country:"Land",
      shipping_method:"Versandart",
      ship_std:"Standard (3–7 Tage)",
      ship_exp:"Express (1–3 Tage)",
      pay_method:"Zahlungsmethode",
      pay_card:"Karte",
      pay_pix:"PIX",
      card_name:"Name auf Karte",
      card_number:"Kartennummer",
      card_exp:"Ablauf (MM/JJ)",
      card_cvv:"CVV",
      pix_note:"PIX-Schlüssel wird beim Abschluss erzeugt (Demo).",
      place_order:"Bestellung abschließen",
      order_ok:"Bestellung abgeschlossen (Demo)! Danke.",
      checkout_terms:"Mit Abschluss akzeptierst du die Bedingungen (Demo).",
  
      opt_type:"Typ",
      opt_profile:"Profil",
      opt_cannabinoid:"Cannabinoid",
      opt_size:"Größe",
      opt_flavor:"Geschmack",
      opt_puffs:"Züge",
      opt_ice:"Eis",
      opt_strain:"Strain",
      opt_strength:"Stärke",
      opt_format:"Format",
      opt_spectrum:"Spektrum",
      opt_mg:"MG",
      opt_dose:"Dosis",
      opt_units:"Einheiten",
  
      med_note_title:"Kurz & locker:",
      med_note:"Cannabinoide und Terpene können bei manchen Menschen Entspannung, Schlaf und Wohlbefinden unterstützen — aber jeder ist anders. Info, kein medizinischer Rat.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Überweisung (TED)",
      pay_doc:"Überweisung (DOC)",
      pay_debit:"Debitkarte",
      pay_credit:"Kreditkarte",
      pay_hint_btc:"Zahle wie du willst — Hemp Store erhält BTC via Lightning.",
      pay_hint_fiat:"BRL-Zahlungen (PIX/Boleto/TED/DOC) bleiben bis zur Bestätigung ausstehend.",
      pay_hint_card:"Kartenzahlung (Debit/Kredit). (Demo) In Produktion über Acquirer/Gateway abwickeln und erst nach Bestätigung freigeben.",
      invoice_title:"BTC-Zahlung (Lightning)",
      invoice_label:"Lightning-Invoice",
      invoice_copy:"Invoice kopieren",
      invoice_copied:"Kopiert!",
      open_wallet:"Wallet öffnen",
      fiat_title:"BRL-Zahlungsinfos",
      fiat_pix_key:"PIX-Schlüssel",
      fiat_pix_payload:"Copy & Paste",
      fiat_boleto_code:"Boleto-Code",
      fiat_bank_name:"Bank",
      fiat_agency:"Filiale",
      fiat_account:"Konto",
      fiat_holder:"Empfänger",
      fiat_cnpj:"Steuer-ID",
      checkout_receive_ln:"Hemp Store erhält BTC via Lightning.",
      order_summary:"Bestellung prüfen",
      card_name_ph:"Wie auf der Karte",
      card_installments:"Raten",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Drücke Enter, um im Katalog zu suchen.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"Wichtige Cannabinoide",
      cannabinoids_sub:"Mehr über gängige Cannabinoide in hanfbasierten Produkten (nur informativ).",
      cann_label_props:"Typische Eigenschaften:",
      cann_label_studied:"Untersucht für:",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Mögliche entzündungshemmende*, beruhigende* und schmerzlindernde* Effekte.",
      cann_cbd_studied:"Wohlbefinden, Entspannung, Schlaf und Komfort — Evidenz variiert.",
      cann_cbd_more:"CBD ist meist nicht berauschend und kommt in Ölen, Gummies und Tierprodukten vor. Etikett und lokale Vorgaben prüfen.",
      cann_thc_title:"THC (Tetrahydrocannabinol)",
      cann_thc_props:"Kann euphorisierend*, schmerzlindernd* und antiemetisch* sein.",
      cann_thc_studied:"Schmerz, Übelkeit und Appetit — nur wo erlaubt; Evidenz variiert.",
      cann_thc_more:"THC ist reguliert und kann berauschend wirken. Nur wo erlaubt und verantwortungsvoll nutzen.",
      cann_cbg_title:"CBG (Cannabigerol)",
      cann_cbg_props:"Mögliche entzündungshemmende* und antioxidative* Aktivität (frühe Evidenz).",
      cann_cbg_studied:"Wellness-Unterstützung und Entzündung — Evidenz noch vorläufig.",
      cann_cbg_more:"CBG ist weniger verbreitet und findet sich oft in gezielten Formeln (Isolate oder Blends).",
      learn_more:"Mehr erfahren",
      cann_note:"*Wirkungen variieren. Nur zu Bildungszwecken; keine medizinische Beratung."

    },
  
    es: {
      home:"Inicio", products:"Productos", about:"Sobre", contact:"Contacto",
      cart:"Carrito", checkout:"Checkout", login:"Login",
      my_orders:"Mis compras",
      language:"Idioma", ok:"OK",
      hero_title:"Lifestyle cannábico",
      hero_sub:"Productos premium a base de cáñamo. Diseño, bienestar y sostenibilidad en un solo lugar.",
      hero_image_label:"Imagen del producto",
      see_products:"Ver productos",
      featured:"Productos Destacados",
      search_ph:"Buscar…",
      all_categories:"Todas las categorías",
      cat_oils:"Aceites",
      cat_strains:"Strains",
      cat_cigars:"Charutos & pre-rolls",
      cat_gummies:"Gomitas",
      cat_extracts:"Extractos",
      cat_drinks:"Bebidas",
      cat_accessories:"Accesorios",
      cat_beverages:"Bebidas",
      cat_vapes:"Vapes",
      cat_pets:"Mascotas",
      cat_edibles:"Comestibles",
  
      back:"← Volver a Productos",
      product_page:"Página de Producto",
      choose:"Elige opciones",
      choose_volume_strain:"Elige volumen y variedad",
      your_config:"Tu configuración",
      desc:"Descripción",
      add_cart:"Agregar al carrito",
      view_cart:"Ver carrito",
      continue:"Seguir comprando",
  
      sign_in:"Entrar",
      sign_out:"Salir",
      email:"Email",
      password:"Contraseña",
      create_demo:"(Demo) Usa cualquier email/contraseña",
  
      empty_cart:"Tu carrito está vacío.",
      item:"Artículo",
      price:"Precio",
      qty:"Cantidad",
      remove:"Quitar",
      subtotal:"Subtotal",
      shipping:"Envío",
      tax:"Impuestos",
      total:"Total",
      go_checkout:"Ir al checkout",
  
      checkout_title:"Checkout detallado",
      step1:"Datos del cliente",
      step2:"Dirección de envío",
      step3:"Envío",
      step4:"Pago",
      step5:"Resumen",
      first:"Nombre", last:"Apellido", phone:"Teléfono",
      doc:"ID / NIF",
      address1:"Calle y número", address2:"Complemento",
      city:"Ciudad", state:"Estado", zip:"CP", country:"País",
      shipping_method:"Método de envío",
      ship_std:"Estándar (3–7 días)",
      ship_exp:"Express (1–3 días)",
      pay_method:"Método de pago",
      pay_card:"Tarjeta",
      pay_pix:"PIX",
      card_name:"Nombre en la tarjeta",
      card_number:"Número de tarjeta",
      card_exp:"Vencimiento (MM/AA)",
      card_cvv:"CVV",
      pix_note:"La clave PIX se generará al finalizar (demo).",
      place_order:"Finalizar compra",
      order_ok:"¡Pedido finalizado (demo)! Gracias.",
      checkout_terms:"Al finalizar aceptas los términos (demo).",
  
      opt_type:"Tipo",
      opt_profile:"Perfil",
      opt_cannabinoid:"Cannabinoide",
      opt_size:"Tamaño",
      opt_flavor:"Sabor",
      opt_puffs:"Puffs",
      opt_ice:"Hielo",
      opt_variety:"Variedade",
      opt_weight:"Peso",
      opt_ml:"ML",
      opt_strain:"Strain",
      opt_strength:"Potencia",
      opt_format:"Formato",
      opt_spectrum:"Espectro",
      opt_mg:"MG",
      opt_dose:"Dosis",
      opt_units:"Unidades",
  
      med_note_title:"Nota rápida:",
      med_note:"Cannabinoides y terpenos pueden apoyar relajación, sueño y bienestar en algunas personas — pero cada uno es diferente. Info, no consejo médico.",
      pay_btc:"Bitcoin (Lightning)",
      pay_boleto:"Boleto",
      pay_ted:"Transferencia (TED)",
      pay_doc:"Transferencia (DOC)",
      pay_debit:"Débito",
      pay_credit:"Crédito",
      pay_hint_btc:"Paga como prefieras — Hemp Store recibe BTC vía Lightning.",
      pay_hint_fiat:"Pagos en BRL (PIX/Boleto/TED/DOC) quedan pendientes hasta confirmación.",
      pay_hint_card:"Pago con tarjeta (débito/crédito). (demo) En producción, procesa con tu adquirente/gateway y libera solo tras confirmación.",
      invoice_title:"Pago en BTC (Lightning)",
      invoice_label:"Invoice Lightning",
      invoice_copy:"Copiar invoice",
      invoice_copied:"¡Copiado!",
      open_wallet:"Abrir wallet",
      fiat_title:"Instrucciones de pago en BRL",
      fiat_pix_key:"Clave PIX",
      fiat_pix_payload:"Copiar y pegar",
      fiat_boleto_code:"Código de boleto",
      fiat_bank_name:"Banco",
      fiat_agency:"Sucursal",
      fiat_account:"Cuenta",
      fiat_holder:"Beneficiario",
      fiat_cnpj:"ID fiscal",
      checkout_receive_ln:"Hemp Store recibe BTC vía Lightning.",
      order_summary:"Resumen del pedido",
      card_name_ph:"Como en la tarjeta",
      card_installments:"Cuotas",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"Presiona Enter para buscar en el catálogo.",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email."
    },

    ja: {
      home:"ホーム", products:"商品", about:"概要", contact:"お問い合わせ",
      cart:"カート", checkout:"チェックアウト", login:"ログイン",
      my_orders:"購入履歴",
      language:"言語", ok:"OK",
      hero_title:"カンナビス・ライフスタイル",
      hero_sub:"高品質ヘンプ製品。デザイン、ウェルネス、サステナビリティをひとつに。",
      hero_image_label:"商品画像",
      see_products:"商品を見る",
      featured:"おすすめ商品",
      search_ph:"商品を検索…",
      all_categories:"すべてのカテゴリー",
      cat_oils:"オイル",
      cat_strains:"ストレイン",
      cat_cigars:"シガー／プレロール",
      cat_gummies:"グミ",
      cat_extracts:"エキス",
      cat_drinks:"ドリンク",
      cat_accessories:"アクセサリー",
      cat_beverages:"ドリンク",
      cat_vapes:"ベイプ",
      cat_pets:"ペット",
      cat_edibles:"エディブル",

      back:"← 商品一覧へ戻る",
      product_page:"商品ページ",
      choose:"オプションを選択",
      choose_volume_strain:"容量とバリエーションを選択",
      your_config:"選択内容",
      desc:"説明",
      add_cart:"カートに追加",
      view_cart:"カートを見る",
      continue:"買い物を続ける",

      sign_in:"ログイン",
      sign_out:"ログアウト",
      email:"メール",
      password:"パスワード",
      create_demo:"（デモ）任意のメール／パスワードでOK",

      empty_cart:"カートは空です。",
      item:"商品",
      price:"価格",
      qty:"数量",
      remove:"削除",
      subtotal:"小計",
      shipping:"送料",
      tax:"税",
      total:"合計",
      go_checkout:"チェックアウトへ",

      checkout_title:"詳細チェックアウト",
      step1:"お客様情報",
      step2:"配送先住所",
      step3:"配送",
      step4:"お支払い",
      step5:"内容確認",
      first:"名", last:"姓", phone:"電話",
      doc:"ID / 税番号",
      address1:"住所（番地まで）", address2:"建物名・部屋番号",
      city:"市区町村", state:"都道府県", zip:"郵便番号", country:"国",
      shipping_method:"配送方法",
      ship_std:"通常（3〜7日）",
      ship_exp:"速達（1〜3日）",
      pay_method:"支払い方法",
      pay_card:"カード",
      pay_pix:"PIX",
      card_name:"名義",
      card_number:"カード番号",
      card_exp:"有効期限 (MM/YY)",
      card_cvv:"CVV",
      pix_note:"注文確定時に PIX キーを生成します（デモ）。",
      place_order:"注文を確定",
      order_ok:"注文完了（デモ）！ありがとうございます。",
      checkout_terms:"注文確定により利用規約に同意したものとみなします（デモ）。",

      opt_type:"タイプ",
      opt_profile:"プロフィール",
      opt_cannabinoid:"カンナビノイド",
      opt_size:"サイズ",
      opt_flavor:"フレーバー",
      opt_puffs:"吸引回数",
      opt_ice:"氷",
      opt_variety:"バリエーション",
      opt_weight:"重量",
      opt_ml:"ML",
      opt_strain:"ストレイン",
      opt_strength:"強さ",
      opt_format:"形式",
      opt_spectrum:"スペクトラム",
      opt_mg:"mg",
      opt_dose:"用量",
      opt_units:"個数",
      opt_spectrum:"スペクトラム",
      opt_mg:"MG",
      opt_dose:"用量",
      opt_units:"個数",

      med_note_title:"メモ：",
      med_note:"カンナビノイドやテルペンはリラックスや睡眠、食欲、ウェルネスをサポートする場合がありますが、感じ方には個人差があります。医療アドバイスではありません。服薬中、妊娠中、疾患がある場合は専門家に相談してください。",


      pay_btc:"ビットコイン（Lightning）",
      pay_boleto:"ボレート",
      pay_ted:"銀行振込（TED）",
      pay_doc:"銀行振込（DOC）",
      pay_debit:"デビット",
      pay_credit:"クレジット",
      pay_hint_btc:"支払い方法は自由 — Hemp Store は Lightning で BTC を受け取ります。",
      pay_hint_fiat:"BRL（PIX/ボレート/TED/DOC）は入金確定まで保留になります。",
      pay_hint_card:"カード決済（デビット/クレジット）。（デモ）本番では決済代行/ゲートウェイで処理し、確認後に確定してください。",
      invoice_title:"BTC 支払い（Lightning）",
      invoice_label:"Lightning インボイス",
      invoice_copy:"コピー",
      invoice_copied:"コピーしました！",
      open_wallet:"ウォレットで開く",
      fiat_title:"BRL 支払い手順",
      fiat_pix_key:"PIX キー",
      fiat_pix_payload:"コピー＆ペースト",
      fiat_boleto_code:"ボレートコード",
      fiat_bank_name:"銀行",
      fiat_agency:"支店",
      fiat_account:"口座",
      fiat_holder:"名義",
      fiat_cnpj:"税ID",
      checkout_receive_ln:"Hemp Store は Lightning で BTC を受け取ります。",
      order_summary:"注文内容の確認",
      card_name_ph:"カード記載通り",
      card_installments:"分割",
      company:"会社",
      footer_nav:"ナビゲーション",
      footer_legal:"リーガル",
      footer_search:"",
      footer_search_hint:"Enterでカタログ検索",
      footer_newsletter:"ニュースレター",
      footer_newsletter_sub:"最新情報・新作をお届け（デモ）。",
      subscribe:"登録",
      email_placeholder:"you@example.com",
      terms:"利用規約",
      privacy:"プライバシー",
      cookies:"クッキー",
      lgpd:"LGPD",
      footer_desc_store:"高品質ヘンプ製品。ウェルネス、デザイン、サステナビリティ。",
      footer_desc_hoc:"規制市場向けのR&D、品質、サプライチェーン。",
      newsletter_success:"登録しました（デモ）",
      newsletter_invalid:"有効なメールを入力してください。",
      cannabinoids_title:"Cannabinoides principales",
      cannabinoids_sub:"Conoce canabinoides comunes en productos a base de cáñamo (solo informativo).",
      cann_label_props:"Propiedades comunes:",
      cann_label_studied:"Estudiado para:",
      cann_cbd_title:"CBD (Cannabidiol)",
      cann_cbd_props:"Posibles efectos antiinflamatorios*, calmantes* y analgésicos*.",
      cann_cbd_studied:"Bienestar, relajación, sueño y confort — la evidencia varía.",
      cann_cbd_more:"El CBD suele no ser intoxicante y aparece en aceites, gomitas y productos para mascotas. Revisa etiquetas y normativa local.",
      cann_thc_title:"THC (Tetrahidrocannabinol)",
      cann_thc_props:"Puede ser euforizante*, analgésico* y antiemético*.",
      cann_thc_studied:"Dolor, náuseas y apetito — solo donde esté permitido; la evidencia varía.",
      cann_thc_more:"El THC está regulado y puede ser intoxicante. Úsalo solo donde sea legal y con responsabilidad.",
      cann_cbg_title:"CBG (Cannabigerol)",
      cann_cbg_props:"Posible actividad antiinflamatoria* y antioxidante* (evidencia inicial).",
      cann_cbg_studied:"Soporte de bienestar e inflamación — evidencia preliminar.",
      cann_cbg_more:"El CBG es menos común y suele aparecer en fórmulas específicas (aislado o mezcla).",
      learn_more:"Saber más",
      cann_note:"*Los efectos varían. Contenido educativo; no es consejo médico."

    },
  
    zh: {
      home:"首页", products:"产品", about:"关于", contact:"联系",
      cart:"购物车", checkout:"结账", login:"登录",
      my_orders:"我的订单",
      language:"语言", ok:"好",
      hero_title:"大麻生活方式",
      hero_sub:"优质工业大麻产品：设计、健康与可持续，一站式体验。",
      hero_image_label:"产品图片",
      see_products:"查看产品",
      featured:"精选推荐",
      search_ph:"搜索…",
      all_categories:"全部分类",
      cat_oils:"精油",
      cat_strains:"品系",
      cat_cigars:"雪茄/预卷",
      cat_gummies:"软糖",
      cat_extracts:"提取物",
      cat_drinks:"饮料",
      cat_accessories:"配件",
      cat_beverages:"饮料",
      cat_vapes:"电子烟",
      cat_pets:"宠物",
      cat_edibles:"食用",
  
      back:"← 返回产品",
      product_page:"产品页",
      choose:"选择选项",
      choose_volume_strain:"选择容量和款式",
      your_config:"你的配置",
      desc:"描述",
      add_cart:"加入购物车",
      view_cart:"查看购物车",
      continue:"继续购物",
  
      sign_in:"登录",
      sign_out:"退出",
      email:"邮箱",
      password:"密码",
      create_demo:"(演示) 任意邮箱/密码都可以",
  
      empty_cart:"购物车为空。",
      item:"商品",
      price:"价格",
      qty:"数量",
      remove:"删除",
      subtotal:"小计",
      shipping:"运费",
      tax:"税费",
      total:"合计",
      go_checkout:"去结账",
  
      checkout_title:"详细结账",
      step1:"客户信息",
      step2:"收货地址",
      step3:"配送",
      step4:"支付",
      step5:"订单汇总",
      first:"名", last:"姓", phone:"电话",
      doc:"证件/税号",
      address1:"街道门牌", address2:"补充信息",
      city:"城市", state:"省/州", zip:"邮编", country:"国家",
      shipping_method:"配送方式",
      ship_std:"标准（3–7天）",
      ship_exp:"加急（1–3天）",
      pay_method:"支付方式",
      pay_card:"银行卡",
      pay_pix:"PIX",
      card_name:"持卡人",
      card_number:"卡号",
      card_exp:"有效期 (MM/YY)",
      card_cvv:"CVV",
      pix_note:"下单时生成 PIX（演示）。",
      place_order:"提交订单",
      order_ok:"下单成功（演示）！谢谢。",
      checkout_terms:"提交即同意条款（演示）。",
  
      opt_type:"类型",
      opt_profile:"谱系",
      opt_cannabinoid:"成分",
      opt_size:"规格",
      opt_flavor:"口味",
      opt_puffs:"抽吸次数",
      opt_ice:"加冰",
      opt_strain:"品系",
      opt_strength:"强度",
      opt_format:"形式",
  
      med_note_title:"小提示：",
      med_note:"大麻素与萜烯可能帮助放松、睡眠与身心舒适——但因人而异。本内容仅供参考，不构成医疗建议。",
      pay_btc:"比特币（Lightning）",
      pay_boleto:"Boleto",
      pay_ted:"银行转账（TED）",
      pay_doc:"银行转账（DOC）",
      pay_debit:"借记卡",
      pay_credit:"信用卡",
      pay_hint_btc:"随你选择支付方式——Hemp Store 通过 Lightning 接收 BTC。",
      pay_hint_fiat:"BRL（PIX/Boleto/TED/DOC）在入账前会保持待处理。",
      pay_hint_card:"银行卡支付（借记/信用）。（演示）生产环境请通过收单机构/网关处理，并在确认后再放行订单。",
      invoice_title:"BTC 支付（Lightning）",
      invoice_label:"Lightning 发票",
      invoice_copy:"复制发票",
      invoice_copied:"已复制！",
      open_wallet:"打开钱包",
      fiat_title:"BRL 支付说明",
      fiat_pix_key:"PIX 密钥",
      fiat_pix_payload:"复制粘贴",
      fiat_boleto_code:"Boleto 代码",
      fiat_bank_name:"银行",
      fiat_agency:"分行",
      fiat_account:"账户",
      fiat_holder:"收款人",
      fiat_cnpj:"税号",
      checkout_receive_ln:"Hemp Store 通过 Lightning 接收 BTC。",
      order_summary:"订单摘要",
      card_name_ph:"与卡一致",
      card_installments:"分期",
      company:"Company",
      footer_nav:"Navigation",
      footer_legal:"Legal",
      footer_search:"",
      footer_search_hint:"按 Enter 搜索目录",
      footer_newsletter:"Newsletter",
      footer_newsletter_sub:"Get updates and launches (demo).",
      subscribe:"Subscribe",
      email_placeholder:"you@example.com",
      terms:"Terms",
      privacy:"Privacy",
      cookies:"Cookies",
      lgpd:"LGPD",
      footer_desc_store:"Premium hemp-based products. Wellness, design and sustainability.",
      footer_desc_hoc:"R&D, quality and supply chain for the regulated market.",
      newsletter_success:"Subscribed! (demo)",
      newsletter_invalid:"Enter a valid email.",
      cannabinoids_title:"主要大麻素",
      cannabinoids_sub:"了解常见的大麻素及其在大麻（工业大麻）产品中的应用（仅供科普）。",
      cann_label_props:"常见特性：",
      cann_label_studied:"研究方向：",
      cann_cbd_title:"CBD（大麻二酚）",
      cann_cbd_props:"可能具有抗炎*、舒缓*与镇痛*等作用。",
      cann_cbd_studied:"放松、睡眠与舒适感——证据因产品与情境而异。",
      cann_cbd_more:"CBD 通常不致醉，常见于油剂、软糖与宠物产品。请查看标签并遵守当地法规。",
      cann_thc_title:"THC（四氢大麻酚）",
      cann_thc_props:"可能致愉悦*、镇痛*与止吐*。",
      cann_thc_studied:"疼痛、恶心与食欲——仅限合法地区；证据不一。",
      cann_thc_more:"THC 受监管且可能致醉。请仅在合法地区并负责任使用。",
      cann_cbg_title:"CBG（大麻萜酚/大麻根酚）",
      cann_cbg_props:"可能具有抗炎*与抗氧化*活性（早期证据）。",
      cann_cbg_studied:"健康支持与炎症——证据仍较初步。",
      cann_cbg_more:"CBG 相对少见，常出现在特定配方（单体或复配）中。",
      learn_more:"了解更多",
      cann_note:"*效果因人而异。科普内容，不构成医疗建议。"

    }
  };
  
  
  /* ---------- i18n extra (products, options, institutional pages) ---------- */
  const I18N_EXTRA={"pt":{"footer_company":"Hemp Store S.A.","footer_group":"Grupo JP. DIETERICH","privacy_title":"Política de Privacidade","legal_model_note":"Documento informativo (modelo). Ajuste com seu advogado para uso real.","privacy_li1":"Podemos coletar dados básicos para operação do carrinho, login (demo) e preferências de idioma.","privacy_li2":"Os dados podem ser armazenados localmente no seu navegador (localStorage) para melhorar a experiência.","privacy_li3":"Você pode solicitar remoção/ajustes conforme legislação aplicável (LGPD).","privacy_li4":"Não vendemos seus dados. Utilizamos apenas para operação e melhoria do serviço.","terms_title":"Termos de Uso","terms_li1":"Ao acessar este site, você concorda com estes termos e com a legislação aplicável.","terms_li2":"As informações aqui contidas têm caráter informativo e podem mudar sem aviso.","terms_li3":"É proibido uso indevido da marca, cópia integral do conteúdo e práticas de scraping abusivas.","terms_li4":"Compras e pagamentos seguem as condições exibidas no checkout.","terms_li5":"Em caso de dúvidas, utilize a página de contato.","cookies_title":"Política de Cookies","cookies_li1":"Este site pode usar armazenamento local/cookies para manter idioma e carrinho.","cookies_li2":"Você pode limpar dados do navegador a qualquer momento para remover preferências.","cookies_li3":"Ferramentas de analytics/marketing só devem ser habilitadas com consentimento (se aplicável).","lgpd_title":"LGPD (Direitos do Titular)","lgpd_li1":"Você pode solicitar: acesso, correção, portabilidade, revogação de consentimento e exclusão.","lgpd_li2":"Canal: privacidade@hempstore.com.br (substitua pelo seu e-mail real).","lgpd_li3":"Base legal e retenção dependem do tipo de dado e obrigações regulatórias/fiscais.","institutional":"Institucional","back_simple":"Voltar","notice":"Aviso","notice_sub":"Conteúdo institucional. Operações e portfólio estão sujeitos à legislação e normas vigentes.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"P&D, qualidade e cadeia de suprimentos para produtos derivados de hemp e cannabis medicinal, com foco em conformidade e rastreabilidade.","hoc_btn_solutions":"Ver soluções","hoc_btn_store":"Ir para a loja (Hemp Store)","hoc_areas_title":"Áreas principais","hoc_badge_rd":"P&D","hoc_card_rd_title":"Pesquisa e desenvolvimento","hoc_card_rd_sub":"Estrutura para especificações, estabilidade, documentação e inovação.","hoc_badge_quality":"Qualidade","hoc_card_quality_title":"Qualidade e rastreabilidade","hoc_card_quality_sub":"Diretrizes de cadeia de custódia, controle por lote e consistência.","hoc_badge_compliance":"Compliance","hoc_card_compliance_title":"Governança e conformidade","hoc_card_compliance_sub":"Políticas internas e adequação a normas aplicáveis (quando exigido).","hoc_contact_title":"Contato B2B","hoc_contact_sub":"Fale com a equipe comercial/técnica para parcerias, distribuição e desenvolvimento de portfólio.","label_email":"Email:","label_partnerships":"Parcerias:","hoc_quick_msg":"Mensagem rápida","label_name":"Nome","label_message":"Mensagem","send":"Enviar","hoc_form_demo":"Formulário demo. Peça integração de envio real.","sol_title":"Soluções (B2B)","sol_sub":"Módulos para qualidade, documentação e cadeia de suprimentos, mantendo o mesmo estilo visual da Hemp Store.","sol_btn_compliance":"P&D + Compliance","sol_deliver_title":"O que entregamos","sol_badge_docs":"Docs","sol_docs_title":"Especificações e documentação","sol_docs_sub":"Fichas técnicas, requisitos de rotulagem, padrões internos e consistência.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain e parceiros","sol_scm_sub":"Curadoria de fornecedores, padronização e rastreabilidade.","sol_badge_brand":"Brand","sol_brand_title":"Estratégia de portfólio","sol_brand_sub":"Arquitetura de linhas e guias de distribuição.","sol_integration_title":"Integração com a Hemp Store","sol_integration_sub":"A operação B2C acontece na Hemp Store S.A. (e-commerce). A Hemp Oil Company estrutura cadeia e P&D.","sol_btn_store_products":"Ver produtos na loja","comp_title":"P&D + Compliance","comp_sub":"Hub institucional para padrões internos, qualidade e rastreabilidade, com linguagem clara e objetiva.","comp_btn_talk":"Falar com a equipe","comp_pillars":"Pilares","comp_badge_sop":"SOP","comp_sop_title":"Procedimentos e padrões","comp_sop_sub":"Documentação orientada a consistência e melhoria contínua.","comp_badge_qa":"QA","comp_qa_title":"Controle de qualidade","comp_qa_sub":"Diretrizes para controle por lote e registros.","comp_badge_legal":"Legal","comp_legal_title":"Conformidade","comp_legal_sub":"Adequação às normas aplicáveis conforme escopo/regulação."},"en":{"footer_company":"Hemp Store S.A.","footer_group":"JP. DIETERICH Group","privacy_title":"Privacy Policy","legal_model_note":"Informational document (template). Review with your lawyer before real use.","privacy_li1":"We may collect basic data to operate the cart, demo login, and language preferences.","privacy_li2":"Data may be stored locally in your browser (localStorage) to improve the experience.","privacy_li3":"You may request deletion/changes as allowed by applicable law (e.g., LGPD).","privacy_li4":"We do not sell your data. We use it only to operate and improve the service.","terms_title":"Terms of Use","terms_li1":"By accessing this site, you agree to these terms and applicable laws.","terms_li2":"Information provided here is for informational purposes and may change without notice.","terms_li3":"Misuse of the brand, full content copying, and abusive scraping practices are prohibited.","terms_li4":"Purchases and payments follow the conditions shown at checkout.","terms_li5":"If you have questions, use the contact page.","cookies_title":"Cookie Policy","cookies_li1":"This site may use local storage/cookies to keep your language and cart.","cookies_li2":"You can clear browser data at any time to remove preferences.","cookies_li3":"Analytics/marketing tools should only be enabled with consent (if applicable).","lgpd_title":"LGPD (Data Subject Rights)","lgpd_li1":"You may request: access, correction, portability, consent withdrawal, and deletion.","lgpd_li2":"Channel: privacidade@hempstore.com.br (replace with your real email).","lgpd_li3":"Legal basis and retention depend on the data type and regulatory/tax obligations.","institutional":"Institutional","back_simple":"Back","notice":"Notice","notice_sub":"Institutional content. Operations and portfolio are subject to current laws and regulations.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"R&D, quality, and supply chain for hemp and medical cannabis–derived products, focused on compliance and traceability.","hoc_btn_solutions":"View solutions","hoc_btn_store":"Go to the store (Hemp Store)","hoc_areas_title":"Key areas","hoc_badge_rd":"R&D","hoc_card_rd_title":"Research & development","hoc_card_rd_sub":"Framework for specifications, stability, documentation, and innovation.","hoc_badge_quality":"Quality","hoc_card_quality_title":"Quality & traceability","hoc_card_quality_sub":"Chain-of-custody guidelines, lot control, and consistency.","hoc_badge_compliance":"Compliance","hoc_card_compliance_title":"Governance & compliance","hoc_card_compliance_sub":"Internal policies and alignment with applicable standards (when required).","hoc_contact_title":"B2B contact","hoc_contact_sub":"Talk to the commercial/technical team about partnerships, distribution, and portfolio development.","label_email":"Email:","label_partnerships":"Partnerships:","hoc_quick_msg":"Quick message","label_name":"Name","label_message":"Message","send":"Send","hoc_form_demo":"Demo form. Request a real sending integration.","sol_title":"Solutions (B2B)","sol_sub":"Modules for quality, documentation, and supply chain—keeping the same visual style as Hemp Store.","sol_btn_compliance":"R&D + Compliance","sol_deliver_title":"What we deliver","sol_badge_docs":"Docs","sol_docs_title":"Specifications & documentation","sol_docs_sub":"Tech sheets, labeling requirements, internal standards, and consistency.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain & partners","sol_scm_sub":"Supplier curation, standardization, and traceability.","sol_badge_brand":"Brand","sol_brand_title":"Portfolio strategy","sol_brand_sub":"Line architecture and distribution guides.","sol_integration_title":"Integration with Hemp Store","sol_integration_sub":"B2C runs on Hemp Store S.A. (e-commerce). Hemp Oil Company structures the supply chain and R&D.","sol_btn_store_products":"View store products","comp_title":"R&D + Compliance","comp_sub":"Institutional hub for internal standards, quality, and traceability—with clear, objective language.","comp_btn_talk":"Talk to the team","comp_pillars":"Pillars","comp_badge_sop":"SOP","comp_sop_title":"Procedures & standards","comp_sop_sub":"Documentation focused on consistency and continuous improvement.","comp_badge_qa":"QA","comp_qa_title":"Quality control","comp_qa_sub":"Guidelines for lot-based control and records.","comp_badge_legal":"Legal","comp_legal_title":"Compliance","comp_legal_sub":"Alignment with applicable standards based on scope/regulation.","Acessórios":"Accessories","Bebida":"Beverage","Charutaria":"Cigars","Comestíveis":"Edibles","Extração":"Extract","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Oil","Óleo CBD Isolado":"CBD Isolate Oil","Óleo Full Spectrum":"Full Spectrum Oil","Óleo CBG":"CBG Oil","Charutos San Juan":"San Juan Cigars","Juanitos • Pré-enrolado 01g":"Juanitos • Pre-roll 1g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (Ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"THC/CBD Diamonds","Gumes":"Gummies","Mel infusionado de THC":"THC-Infused Honey","Manteiga Trufada de THC":"THC-Infused Butter","Chocolate":"Chocolate","Chicletes CBD e THC":"CBD & THC Chewing Gum","Refrigerante infusionado (THC/CBD)":"Infused Soda (THC/CBD)","Chá infusionado THC":"THC-Infused Tea","Limonada infusionada THC":"THC-Infused Lemonade","Vape THC":"THC Vape","Óleo CBD Pet":"CBD Pet Oil","Petiscos mastigáveis CBD":"CBD Chews (Pets)","Bálsamo tópico com cânhamo/CBD":"Hemp/CBD Topical Balm","Shampoo calmante com cânhamo":"Calming Hemp Shampoo","Canetas Hemp":"Hemp Pens","Camisetas":"T-Shirts","Bonés (estilo trucker)":"Trucker Caps","Dichavadores":"Grinders","Piteiras":"Tips / Mouthpieces","Sedas":"Rolling Papers","Bolador":"Roller","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolate • 30ml (demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Full Spectrum • 30ml (demo)","CBG • Isolado • 30ml (demo)":"CBG • Isolate • 30ml (demo)","Configuração por peso e strain (demo)":"Configure by weight & strain (demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Pre-roll • 1g • selectable strain (demo)","Extração (demo) • strain selecionável":"Extract (demo) • selectable strain","Comestível (demo) • sabores • 50g / 100g":"Edible (demo) • flavors • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Edible (demo) • THC (where legal) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Edible (demo) • THC (where legal) • 100g","Comestível (demo) • CBD/THC • 100g":"Edible (demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Edible (demo) • CBD/THC • units","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Beverage • THC/CBD • 330ml / 500ml (demo, where legal)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Beverage • THC • 300ml / 500ml (demo, where legal)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Beverage • THC • 400ml / 700ml (demo, where legal)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 puffs (demo, where legal)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (demo) • hemp/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (demo) • snacks • units","Pet (demo) • uso tópico":"Pet (demo) • topical","Pet (demo) • higiene":"Pet (demo) • hygiene","Acessório • escrita/coleção":"Accessory • writing/collectible","Acessório • apparel":"Accessory • apparel","Acessório • boné":"Accessory • cap","Acessório • diversos modelos":"Accessory • various models","Acessório • enrolar":"Accessory • rolling","Acessório • papéis":"Accessory • papers","Acessório • tamanhos P / M / G":"Accessory • sizes S / M / L","Acessório • vidro/acrílico":"Accessory • glass/acrylic","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Selectable variety • 5g / 10g (demo, where legal)","Bolador (demo). Ajuda a manter consistência na montagem.":"Roller (demo). Helps keep consistency when rolling.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (demo). Use safely and keep them clean.","Bonés trucker (demo). Leve e ventilado.":"Trucker caps (demo). Light and breathable.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Topical balm (demo). Common in pet hemp lines—check ingredients and patch test first.","Camisetas (demo). Modelagem básica e minimalista.":"T-Shirts (demo). Basic, minimalist fit.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hemp Pens (demo). A touch of style for everyday.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San Juan Cigars (demo). Select weight and strain. Where legal, the experience often involves aroma and ritual. Use responsibly.","Chicletes (demo). Discretos e fáceis de dosar.":"Chewing gum (demo). Discreet and easy to dose.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Chocolate (demo). A classic edible—remember onset can be slower.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infused tea (demo). Choose flavor and volume. Always check local legality and use responsibly.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinders (demo). An even grind improves consistency and reduces waste.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extracts (demo). Generally more concentrated—start low and use responsibly (and comply with local law).","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gummies (demo). Practical and discreet. Edibles may take longer to kick in—go slow.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (demo). 1g pre-roll with selectable strain. Prefer safe settings and smaller doses.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infused lemonade (demo). Select volume and ice. Always check local legality and use responsibly.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Truffle butter (demo). Great for recipes—dose control is essential.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Infused honey (demo). Great with tea and recipes—watch the dose.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBD chews (demo). Chew snacks for routine/training. Check ingredient/label compliance in your jurisdiction.","Piteiras (demo). Conforto e melhor fluxo.":"Tips (demo). Comfort and better airflow.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Infused soda (demo). Select cannabinoid, volume, and flavor. Always check local legality and use responsibly.","Sedas (demo). Papéis clássicos e práticos.":"Rolling papers (demo). Classic, practical papers.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Hemp shampoo (demo). A hygiene product with wellness appeal—choose gentle formulas suitable for pets.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THC vape (demo). Select puff count and flavor. Always check local legality and use responsibly.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBD Isolate Oil (demo). Isolate focuses on a primary cannabinoid with a more neutral profile. Always confirm local legality and use responsibly.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"CBD pet oil (demo). Hemp-based CBD pet products are common where legal; avoid medical claims and follow veterinary guidance.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBG Oil (demo). Often formulated with cannabigerol. Check the label and local compliance/legal status.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Full Spectrum Oil (demo). Typically includes a broader set of hemp compounds (including terpenes), which can change aroma and experience. Check label and compliance.","Isolado":"Isolate","THC (onde permitido)":"THC (where legal)","100 puxadas":"100 puffs","1000 puxadas":"1000 puffs","10 un.":"10 pcs","30 un.":"30 pcs","32 un.":"32 pcs","50 un.":"50 pcs","60 un.":"60 pcs","01g":"1g","Com gelo":"With ice","Sem gelo":"No ice","Pequeno":"Small","Médio":"Medium","Grande":"Large","Branco":"White","Branca":"White","Preto":"Black","Preta":"Black","Verde":"Green","Madeira":"Wood","Metal":"Metal","Vidro":"Glass","Acrílico":"Acrylic","Cão":"Dog","Gato":"Cat","Frango":"Chicken","Salmão":"Salmon","Amargo":"Dark","Ao leite":"Milk","Camomila":"Chamomile","Gengibre":"Ginger","Hortelã":"Mint","Menta":"Mint","Mint":"Mint","Morango":"Strawberry","Melancia":"Watermelon","Uva":"Grape","Laranja":"Orange","Limão":"Lemon","Tangerina":"Tangerine","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"S","M":"M","G":"L","GG":"XL"},"es":{"footer_company":"Hemp Store S.A.","footer_group":"Grupo JP. DIETERICH","privacy_title":"Política de Privacidad","legal_model_note":"Documento informativo (modelo). Ajuste con su abogado para uso real.","privacy_li1":"Podemos recopilar datos básicos para operar el carrito, el login (demo) y las preferencias de idioma.","privacy_li2":"Los datos pueden almacenarse localmente en su navegador (localStorage) para mejorar la experiencia.","privacy_li3":"Puede solicitar eliminación/ajustes según la legislación aplicable (LGPD).","privacy_li4":"No vendemos sus datos. Los usamos solo para operar y mejorar el servicio.","terms_title":"Términos de Uso","terms_li1":"Al acceder a este sitio, usted acepta estos términos y la legislación aplicable.","terms_li2":"La información aquí contenida es informativa y puede cambiar sin previo aviso.","terms_li3":"Está prohibido el uso indebido de la marca, la copia íntegra del contenido y prácticas de scraping abusivas.","terms_li4":"Compras y pagos siguen las condiciones mostradas en el checkout.","terms_li5":"En caso de dudas, use la página de contacto.","cookies_title":"Política de Cookies","cookies_li1":"Este sitio puede usar almacenamiento local/cookies para mantener el idioma y el carrito.","cookies_li2":"Puede borrar los datos del navegador en cualquier momento para eliminar preferencias.","cookies_li3":"Herramientas de analítica/marketing solo deben habilitarse con consentimiento (si aplica).","lgpd_title":"LGPD (Derechos del Titular)","lgpd_li1":"Puede solicitar: acceso, corrección, portabilidad, revocación del consentimiento y eliminación.","lgpd_li2":"Canal: privacidade@hempstore.com.br (reemplace por su correo real).","lgpd_li3":"La base legal y la retención dependen del tipo de dato y obligaciones regulatorias/fiscales.","institutional":"institutional","back_simple":"Volver","notice":"notice","notice_sub":"Contenido institucional. Operaciones y portafolio están sujetos a la legislación y normas vigentes.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"I+D, calidad y cadena de suministro para productos derivados de hemp y cannabis medicinal, con foco en cumplimiento y trazabilidad.","hoc_btn_solutions":"Ver soluciones","hoc_btn_store":"Ir a la tienda (Hemp Store)","hoc_areas_title":"Áreas principales","hoc_badge_rd":"I+D","hoc_card_rd_title":"Investigación y desarrollo","hoc_card_rd_sub":"Estructura para especificaciones, estabilidad, documentación e innovación.","hoc_badge_quality":"Calidad","hoc_card_quality_title":"Calidad y trazabilidad","hoc_card_quality_sub":"Directrices de cadena de custodia, control por lote y consistencia.","hoc_badge_compliance":"Cumplimiento","hoc_card_compliance_title":"Gobernanza y cumplimiento","hoc_card_compliance_sub":"Políticas internas y adecuación a normas aplicables (cuando se requiera).","hoc_contact_title":"Contacto B2B","hoc_contact_sub":"Hable con el equipo comercial/técnico para alianzas, distribución y desarrollo de portafolio.","label_email":"Email:","label_partnerships":"Alianzas:","hoc_quick_msg":"Mensaje rápido","label_name":"Nombre","label_message":"Mensaje","send":"send","hoc_form_demo":"Formulario demo. Solicite integración de envío real.","sol_title":"Soluciones (B2B)","sol_sub":"Módulos para calidad, documentación y cadena de suministro, manteniendo el mismo estilo visual de Hemp Store.","sol_btn_compliance":"I+D + Cumplimiento","sol_deliver_title":"Qué entregamos","sol_badge_docs":"Docs","sol_docs_title":"Especificaciones y documentación","sol_docs_sub":"Fichas técnicas, requisitos de etiquetado, estándares internos y consistencia.","sol_badge_scm":"SCM","sol_scm_title":"Cadena de suministro y socios","sol_scm_sub":"Curaduría de proveedores, estandarización y trazabilidad.","sol_badge_brand":"Marca","sol_brand_title":"Estrategia de portafolio","sol_brand_sub":"Arquitectura de líneas y guías de distribución.","sol_integration_title":"Integración con Hemp Store","sol_integration_sub":"La operación B2C sucede en Hemp Store S.A. (e-commerce). Hemp Oil Company estructura la cadena e I+D.","sol_btn_store_products":"Ver productos en la tienda","comp_title":"I+D + Cumplimiento","comp_sub":"Hub institucional para estándares internos, calidad y trazabilidad, con lenguaje claro y objetivo.","comp_btn_talk":"Hablar con el equipo","comp_pillars":"Pilares","comp_badge_sop":"SOP","comp_sop_title":"Procedimientos y estándares","comp_sop_sub":"Documentación orientada a la consistencia y mejora continua.","comp_badge_qa":"QA","comp_qa_title":"Control de calidad","comp_qa_sub":"Directrices para control por lote y registros.","comp_badge_legal":"Legal","comp_legal_title":"Cumplimiento","comp_legal_sub":"Adecuación a las normas aplicables según el alcance/regulación.","Acessórios":"Accesorios","Bebida":"Bebida","Charutaria":"Charutería","Comestíveis":"Comestibles","Extração":"Extracción","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Aceite","Óleo CBD Isolado":"Aceite CBD Aislado","Óleo Full Spectrum":"Aceite Espectro completo","Óleo CBG":"Aceite CBG","Charutos San Juan":"Puros San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"Diamonds THC/CBD","Gumes":"Gumes","Mel infusionado de THC":"Miel infusionada de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Chocolate","Chicletes CBD e THC":"Chicles CBD e THC","Refrigerante infusionado (THC/CBD)":"Refresco infusionado (THC/CBD)","Chá infusionado THC":"Té infusionado THC","Limonada infusionada THC":"Limonada infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Aceite CBD Pet","Petiscos mastigáveis CBD":"Snacks mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Bálsamo tópico com cáñamo/CBD","Shampoo calmante com cânhamo":"Champú calmante com cáñamo","Canetas Hemp":"Bolígrafos Hemp","Camisetas":"Camisetas","Bonés (estilo trucker)":"Gorras (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Liadora","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Aislado • 30ml (demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Espectro completo • 30ml (demo)","CBG • Isolado • 30ml (demo)":"CBG • Aislado • 30ml (demo)","Configuração por peso e strain (demo)":"Configuración por peso y cepa (demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Cigarrillo pre-rolado • 01g • cepa seleccionable (demo)","Extração (demo) • strain selecionável":"Extracción (demo) • cepa seleccionable","Comestível (demo) • sabores • 50g / 100g":"Comestible (demo) • sabores • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Comestible (demo) • THC (donde esté permitido) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Comestible (demo) • THC (donde esté permitido) • 100g","Comestível (demo) • CBD/THC • 100g":"Comestible (demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Comestible (demo) • CBD/THC • unidades","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Bebida • THC/CBD • 330ml / 500ml (demo, donde esté permitido)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Bebida • THC • 300ml / 500ml (demo, donde esté permitido)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Bebida • THC • 400ml / 700ml (demo, donde esté permitido)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 caladas (demo, donde esté permitido)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (demo) • cáñamo/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (demo) • snacks • unidades","Pet (demo) • uso tópico":"Pet (demo) • uso tópico","Pet (demo) • higiene":"Pet (demo) • higiene","Acessório • escrita/coleção":"Accesorio • escritura/colección","Acessório • apparel":"Accesorio • apparel","Acessório • boné":"Accesorio • boné","Acessório • diversos modelos":"Accesorio • diversos modelos","Acessório • enrolar":"Accesorio • enrolar","Acessório • papéis":"Accesorio • papéis","Acessório • tamanhos P / M / G":"Accesorio • tamanhos P / M / G","Acessório • vidro/acrílico":"Accesorio • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Varíedad seleccionable • 5g / 10g (demo, donde esté permitido)","Bolador (demo). Ajuda a manter consistência na montagem.":"Liadora (demo). Ayuda a mantener la consistencia al armar.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (demo). Úselos con seguridad y mantenga la limpieza.","Bonés trucker (demo). Leve e ventilado.":"Gorras trucker (demo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Bálsamo tópico (demo). Opción común en líneas pet con cáñamo: revise la composición y haga una prueba en un área pequeña.","Camisetas (demo). Modelagem básica e minimalista.":"Camisetas (demo). Corte básico y minimalista.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Bolígrafos Hemp (demo). Un toque de estilo para el día a día.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"Puros San Juan (demo). Seleccione peso y cepa. Donde esté permitido, la experiencia suele incluir aroma y ritual. Úselo con responsabilidad.","Chicletes (demo). Discretos e fáceis de dosar.":"Chicles (demo). Discretos y fáciles de dosificar.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Chocolate (demo). Una forma clásica de consumo; recuerde que la absorción puede ser más lenta.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"Té infusionado con THC (demo). Elija sabor y volumen. Verifique siempre la legalidad local y consuma con responsabilidad.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Trituradores (demo). Una molienda uniforme ayuda a la consistencia y reduce el desperdicio.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extracciones (demo). Por lo general son más concentradas: empiece con poco y úselo con responsabilidad (según la legislación local).","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gomitas (demo). Prácticas y discretas. Los comestibles pueden tardar más en hacer efecto: vaya con calma.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (demo). Pre-rolado de 01g con selección de cepa. Prefiera ambientes seguros y dosis menores.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"Limonada infusionada con THC (demo). Seleccione volumen y hielo. Verifique siempre la legalidad local y consuma con responsabilidad.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Mantequilla trufada (demo). Ideal para recetas: el control de dosis es esencial.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Miel infusionada (demo). Combina con tés y recetas: atención a la dosis.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"Snacks de CBD (demo). Línea de bocados masticables para rutina/entrenamiento. Verifique ingredientes y etiquetado según su jurisdicción.","Piteiras (demo). Conforto e melhor fluxo.":"Boquillas (demo). Más comodidad y mejor flujo.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Refresco infusionado (demo). Seleccione cannabinoide, volumen y sabor. Verifique siempre la legalidad local y consuma con responsabilidad.","Sedas (demo). Papéis clássicos e práticos.":"Papeles (demo). Clásicos y prácticos.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Champú con cáñamo (demo). Producto de higiene con enfoque de bienestar: elija fórmulas suaves y aptas para mascotas.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"Vape de THC (demo). Seleccione cantidad de caladas y sabor. Verifique siempre la legalidad local y úselo con responsabilidad.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"Aceite de CBD aislado (demo). Se centra en un cannabinoide principal, con un perfil más neutro. Confirme siempre la legalidad local y úselo con responsabilidad.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"Aceite de CBD para mascotas (demo). Son comunes en mercados donde está permitido; evite afirmaciones médicas y siga orientación veterinaria.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"Aceite de CBG (demo). Generalmente formulado con cannabigerol. Revise la etiqueta y la conformidad/legalidad local.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Aceite Full Spectrum (demo). Suele incluir más compuestos del cáñamo (incluidos terpenos), lo que puede cambiar aroma y experiencia. Revise etiqueta y cumplimiento.","Isolado":"Aislado","THC (onde permitido)":"THC (donde esté permitido)","100 puxadas":"100 caladas","1000 puxadas":"1000 caladas","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com hielo","Sem gelo":"Sem hielo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Blanco","Branca":"Blanca","Preto":"Negro","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Vidrio","Acrílico":"Acrílico","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Amargo","Ao leite":"Con leche","Camomila":"Manzanilla","Gengibre":"Jengibre","Hortelã":"Menta","Menta":"Menta","Mint":"Mint","Morango":"Fresa","Melancia":"Sandía","Uva":"Uva","Laranja":"Naranja","Limão":"Limón","Tangerina":"Mandarina","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"fr":{"footer_company":"Hemp Store S.A.","footer_group":"Groupe JP. DIETERICH","privacy_title":"Politique de confidentialité","legal_model_note":"Document informatif (modèle). Ajustez avec votre avocat pour un usage réel.","privacy_li1":"Nous pouvons collecter des données de base pour le panier, le login (démo) et les préférences de langue.","privacy_li2":"Les données peuvent être stockées localement dans votre navigateur (localStorage) pour améliorer l’expérience.","privacy_li3":"Vous pouvez demander suppression/ajustements selon la législation applicable (LGPD).","privacy_li4":"Nous ne vendons pas vos données. Nous les utilisons uniquement pour opérer et améliorer le service.","terms_title":"Conditions d’utilisation","terms_li1":"En accédant à ce site, vous acceptez ces conditions et la législation applicable.","terms_li2":"Les informations ici sont à titre indicatif et peuvent changer sans préavis.","terms_li3":"L’usage abusif de la marque, la copie intégrale du contenu et le scraping abusif sont interdits.","terms_li4":"Les achats et paiements suivent les conditions affichées au checkout.","terms_li5":"En cas de doute, utilisez la page de contact.","cookies_title":"Politique de cookies","cookies_li1":"Ce site peut utiliser le stockage local/cookies pour conserver la langue et le panier.","cookies_li2":"Vous pouvez effacer les données du navigateur à tout moment pour supprimer les préférences.","cookies_li3":"Les outils d’analytics/marketing ne doivent être activés qu’avec consentement (si applicable).","lgpd_title":"LGPD (Droits de la personne)","lgpd_li1":"Vous pouvez demander : accès, correction, portabilité, retrait du consentement et suppression.","lgpd_li2":"Canal : privacidade@hempstore.com.br (remplacez par votre e-mail réel).","lgpd_li3":"La base légale et la rétention dépendent du type de donnée et des obligations réglementaires/fiscales.","institutional":"institutional","back_simple":"Retour","notice":"notice","notice_sub":"Contenu institutionnel. Les opérations et le portefeuille sont soumis aux lois et normes en vigueur.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"R&D, qualité et supply chain pour des produits dérivés du hemp et du cannabis médical, axés sur la conformité et la traçabilité.","hoc_btn_solutions":"Voir les solutions","hoc_btn_store":"Aller à la boutique (Hemp Store)","hoc_areas_title":"Domaines principaux","hoc_badge_rd":"R&D","hoc_card_rd_title":"Recherche & développement","hoc_card_rd_sub":"Cadre pour spécifications, stabilité, documentation et innovation.","hoc_badge_quality":"Qualité","hoc_card_quality_title":"Qualité et traçabilité","hoc_card_quality_sub":"Directives de chaîne de possession, contrôle par lot et cohérence.","hoc_badge_compliance":"Conformité","hoc_card_compliance_title":"Gouvernance et conformité","hoc_card_compliance_sub":"Politiques internes et conformité aux normes applicables (lorsque requis).","hoc_contact_title":"Contact B2B","hoc_contact_sub":"Contactez l’équipe commerciale/technique pour partenariats, distribution et développement de portefeuille.","label_email":"E-mail :","label_partnerships":"Partenariats :","hoc_quick_msg":"Message rapide","label_name":"Nom","label_message":"Message","send":"send","hoc_form_demo":"Formulaire démo. Demandez l’intégration d’un envoi réel.","sol_title":"Solutions (B2B)","sol_sub":"Modules pour qualité, documentation et supply chain, en conservant le style visuel de Hemp Store.","sol_btn_compliance":"R&D + Conformité","sol_deliver_title":"Ce que nous livrons","sol_badge_docs":"Docs","sol_docs_title":"Spécifications et documentation","sol_docs_sub":"Fiches techniques, exigences d’étiquetage, standards internes et cohérence.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain et partenaires","sol_scm_sub":"Sélection de fournisseurs, standardisation et traçabilité.","sol_badge_brand":"Marque","sol_brand_title":"Stratégie de portefeuille","sol_brand_sub":"Architecture des gammes et guides de distribution.","sol_integration_title":"Intégration avec Hemp Store","sol_integration_sub":"L’activité B2C se fait sur Hemp Store S.A. (e-commerce). Hemp Oil Company structure la chaîne et la R&D.","sol_btn_store_products":"Voir les produits en boutique","comp_title":"R&D + Conformité","comp_sub":"Hub institutionnel pour standards internes, qualité et traçabilité, avec un langage clair et objectif.","comp_btn_talk":"Parler à l’équipe","comp_pillars":"Piliers","comp_badge_sop":"SOP","comp_sop_title":"Procédures et standards","comp_sop_sub":"Documentation orientée vers la cohérence et l’amélioration continue.","comp_badge_qa":"QA","comp_qa_title":"Contrôle qualité","comp_qa_sub":"Directives pour le contrôle par lot et les enregistrements.","comp_badge_legal":"Légal","comp_legal_title":"Conformité","comp_legal_sub":"Mise en conformité avec les normes applicables selon le périmètre/la réglementation.","Acessórios":"Accessoires","Bebida":"Boisson","Charutaria":"Cigares","Comestíveis":"Comestibles","Extração":"Extrait","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Huile","Óleo CBD Isolado":"Huile CBD Isolat","Óleo Full Spectrum":"Huile Spectre complet","Óleo CBG":"Huile CBG","Charutos San Juan":"Cigares San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"Diamonds THC/CBD","Gumes":"Gumes","Mel infusionado de THC":"Miel infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Chocolat","Chicletes CBD e THC":"Chewing-gums CBD e THC","Refrigerante infusionado (THC/CBD)":"Soda infusionado (THC/CBD)","Chá infusionado THC":"Thé infusionado THC","Limonada infusionada THC":"Limonade infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Huile CBD Pet","Petiscos mastigáveis CBD":"Friandises mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Baume tópico com chanvre/CBD","Shampoo calmante com cânhamo":"Shampooing calmante com chanvre","Canetas Hemp":"Stylos Hemp","Camisetas":"T-shirts","Bonés (estilo trucker)":"Casquettes (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Rouleur","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolat • 30ml (démo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Spectre complet • 30ml (démo)","CBG • Isolado • 30ml (demo)":"CBG • Isolat • 30ml (démo)","Configuração por peso e strain (demo)":"Configuration par poids et variété (démo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Cigarette pré-roulée • 01g • variété au choix (démo)","Extração (demo) • strain selecionável":"Extrait (démo) • variété au choix","Comestível (demo) • sabores • 50g / 100g":"Comestible (démo) • saveurs • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Comestible (démo) • THC (là où c’est autorisé) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Comestible (démo) • THC (là où c’est autorisé) • 100g","Comestível (demo) • CBD/THC • 100g":"Comestible (démo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Comestible (démo) • CBD/THC • unités","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Boisson • THC/CBD • 330ml / 500ml (démo, là où c’est autorisé)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Boisson • THC • 300ml / 500ml (démo, là où c’est autorisé)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Boisson • THC • 400ml / 700ml (démo, là où c’est autorisé)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 bouffées (démo, là où c’est autorisé)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (démo) • chanvre/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (démo) • snacks • unités","Pet (demo) • uso tópico":"Pet (démo) • usage topique","Pet (demo) • higiene":"Pet (démo) • hygiène","Acessório • escrita/coleção":"Accessoire • escrita/coleção","Acessório • apparel":"Accessoire • apparel","Acessório • boné":"Accessoire • boné","Acessório • diversos modelos":"Accessoire • diversos modelos","Acessório • enrolar":"Accessoire • enrolar","Acessório • papéis":"Accessoire • papéis","Acessório • tamanhos P / M / G":"Accessoire • tamanhos P / M / G","Acessório • vidro/acrílico":"Accessoire • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Variété au choix • 5g / 10g (démo, là où c’est autorisé)","Bolador (demo). Ajuda a manter consistência na montagem.":"Rouleur (démo). Aide à garder une consistance lors du roulage.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (démo). Utilisez en toute sécurité et entretenez la propreté.","Bonés trucker (demo). Leve e ventilado.":"Casquettes trucker (démo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Baume topique (démo). Option courante en gammes pet au chanvre — vérifiez la composition et testez sur une petite zone.","Camisetas (demo). Modelagem básica e minimalista.":"T-shirts (démo). Coupe basique et minimaliste.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Stylos Hemp (démo). Une touche de style au quotidien.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"Cigares San Juan (démo). Sélectionnez le poids et la variété. Là où c’est autorisé, l’expérience implique souvent arôme et rituel. Utilisez de manière responsable.","Chicletes (demo). Discretos e fáceis de dosar.":"Chewing-gums (démo). Discrets et faciles à doser.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Chocolat (démo). Une forme classique ; n’oubliez pas que l’absorption peut être plus lente.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"Thé infusé au THC (démo). Choisissez saveur et volume. Vérifiez toujours la légalité locale et consommez de manière responsable.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinders (démo). Une mouture uniforme améliore la cohérence et réduit le gaspillage.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extraits (démo). En général plus concentrés — commencez doucement et utilisez de manière responsable (selon la législation locale).","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gummies (démo). Pratiques et discrets. Les comestibles peuvent agir plus lentement — allez-y doucement.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (démo). Pré-roulé de 01g avec sélection de variété. Privilégiez des environnements sûrs et de petites doses.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"Limonade infusée au THC (démo). Sélectionnez volume et glaçons. Vérifiez toujours la légalité locale et consommez de manière responsable.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Beurre truffé (démo). Idéal pour les recettes — le contrôle de dose est essentiel.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Miel infusé (démo). Parfait avec thés et recettes — attention au dosage.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"Friandises CBD (démo). Snacks à mâcher pour routine/entraînement. Vérifiez la conformité des ingrédients et l’étiquetage selon votre juridiction.","Piteiras (demo). Conforto e melhor fluxo.":"Embouts (démo). Plus de confort et meilleur tirage.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Soda infusé (démo). Sélectionnez cannabinoïde, volume et saveur. Vérifiez toujours la légalité locale et consommez de manière responsable.","Sedas (demo). Papéis clássicos e práticos.":"Papiers (démo). Classiques et pratiques.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Shampooing au chanvre (démo). Produit d’hygiène axé bien-être — choisissez des formules douces adaptées aux animaux.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"Vape THC (démo). Sélectionnez le nombre de bouffées et la saveur. Vérifiez toujours la légalité locale et utilisez de manière responsable.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"Huile CBD Isolat (démo). Axée sur un cannabinoïde principal, au profil plus neutre. Confirmez la légalité locale et utilisez de manière responsable.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"Huile CBD pour animaux (démo). Courante là où c’est autorisé ; évitez les allégations médicales et suivez les conseils vétérinaires.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"Huile CBG (démo). Généralement formulée avec du cannabigérol. Vérifiez l’étiquette et la conformité/légalité locale.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Huile Full Spectrum (démo). Contient généralement davantage de composés du chanvre (dont des terpènes), ce qui peut modifier l’arôme et l’expérience. Vérifiez l’étiquette et la conformité.","Isolado":"Isolat","THC (onde permitido)":"THC (là où c’est autorisé)","100 puxadas":"100 bouffées","1000 puxadas":"1000 bouffées","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Blanc","Branca":"Blanche","Preto":"Noir","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Verre","Acrílico":"Acrylique","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Noir","Ao leite":"Au lait","Camomila":"Camomille","Gengibre":"Gingembre","Hortelã":"Menthe","Menta":"Menta","Mint":"Mint","Morango":"Fraise","Melancia":"Pastèque","Uva":"Raisin","Laranja":"Orange","Limão":"Citron","Tangerina":"Mandarine","Manga":"Mangue","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"it":{"footer_company":"Hemp Store S.A.","footer_group":"Gruppo JP. DIETERICH","privacy_title":"Informativa sulla privacy","legal_model_note":"Documento informativo (modello). Adattalo con il tuo avvocato per uso reale.","privacy_li1":"Possiamo raccogliere dati di base per il carrello, il login (demo) e le preferenze di lingua.","privacy_li2":"I dati possono essere salvati localmente nel tuo browser (localStorage) per migliorare l’esperienza.","privacy_li3":"Puoi richiedere rimozione/aggiustamenti secondo la normativa applicabile (LGPD).","privacy_li4":"Non vendiamo i tuoi dati. Li usiamo solo per operare e migliorare il servizio.","terms_title":"Termini di utilizzo","terms_li1":"Accedendo a questo sito, accetti questi termini e la normativa applicabile.","terms_li2":"Le informazioni qui presenti sono informative e possono cambiare senza preavviso.","terms_li3":"È vietato l’uso improprio del marchio, la copia integrale dei contenuti e pratiche di scraping abusive.","terms_li4":"Acquisti e pagamenti seguono le condizioni mostrate nel checkout.","terms_li5":"In caso di dubbi, usa la pagina contatti.","cookies_title":"Informativa sui cookie","cookies_li1":"Questo sito può usare storage locale/cookie per mantenere lingua e carrello.","cookies_li2":"Puoi cancellare i dati del browser in qualsiasi momento per rimuovere preferenze.","cookies_li3":"Strumenti di analytics/marketing devono essere abilitati solo con consenso (se applicabile).","lgpd_title":"LGPD (Diritti dell’interessato)","lgpd_li1":"Puoi richiedere: accesso, correzione, portabilità, revoca del consenso e cancellazione.","lgpd_li2":"Canale: privacidade@hempstore.com.br (sostituisci con la tua email reale).","lgpd_li3":"Base giuridica e conservazione dipendono dal tipo di dato e da obblighi regolatori/fiscali.","institutional":"institutional","back_simple":"Indietro","notice":"notice","notice_sub":"Contenuto istituzionale. Operazioni e portafoglio sono soggetti a leggi e norme vigenti.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"R&S, qualità e supply chain per prodotti derivati da hemp e cannabis medicinale, con focus su conformità e tracciabilità.","hoc_btn_solutions":"Vedi soluzioni","hoc_btn_store":"Vai al negozio (Hemp Store)","hoc_areas_title":"Aree principali","hoc_badge_rd":"R&S","hoc_card_rd_title":"Ricerca e sviluppo","hoc_card_rd_sub":"Struttura per specifiche, stabilità, documentazione e innovazione.","hoc_badge_quality":"Qualità","hoc_card_quality_title":"Qualità e tracciabilità","hoc_card_quality_sub":"Linee guida su catena di custodia, controllo per lotto e coerenza.","hoc_badge_compliance":"Conformità","hoc_card_compliance_title":"Governance e conformità","hoc_card_compliance_sub":"Policy interne e conformità alle norme applicabili (quando richiesto).","hoc_contact_title":"Contatto B2B","hoc_contact_sub":"Contatta il team commerciale/tecnico per partnership, distribuzione e sviluppo del portafoglio.","label_email":"Email:","label_partnerships":"Partnership:","hoc_quick_msg":"Messaggio rapido","label_name":"Nome","label_message":"Messaggio","send":"send","hoc_form_demo":"Modulo demo. Richiedi integrazione di invio reale.","sol_title":"Soluzioni (B2B)","sol_sub":"Moduli per qualità, documentazione e supply chain, mantenendo lo stesso stile visivo di Hemp Store.","sol_btn_compliance":"R&S + Conformità","sol_deliver_title":"Cosa consegniamo","sol_badge_docs":"Docs","sol_docs_title":"Specifiche e documentazione","sol_docs_sub":"Schede tecniche, requisiti di etichettatura, standard interni e coerenza.","sol_badge_scm":"SCM","sol_scm_title":"Supply chain e partner","sol_scm_sub":"Selezione fornitori, standardizzazione e tracciabilità.","sol_badge_brand":"Brand","sol_brand_title":"Strategia di portafoglio","sol_brand_sub":"Architettura delle linee e guide di distribuzione.","sol_integration_title":"Integrazione con Hemp Store","sol_integration_sub":"L’operatività B2C avviene su Hemp Store S.A. (e-commerce). Hemp Oil Company struttura la catena e la R&S.","sol_btn_store_products":"Vedi prodotti in negozio","comp_title":"R&S + Conformità","comp_sub":"Hub istituzionale per standard interni, qualità e tracciabilità, con linguaggio chiaro e diretto.","comp_btn_talk":"Parla con il team","comp_pillars":"Pilastri","comp_badge_sop":"SOP","comp_sop_title":"Procedure e standard","comp_sop_sub":"Documentazione orientata a coerenza e miglioramento continuo.","comp_badge_qa":"QA","comp_qa_title":"Controllo qualità","comp_qa_sub":"Linee guida per controllo per lotto e registri.","comp_badge_legal":"Legale","comp_legal_title":"Conformità","comp_legal_sub":"Adeguamento alle norme applicabili secondo ambito/regolazione.","Acessórios":"Accessori","Bebida":"Bevanda","Charutaria":"Sigari","Comestíveis":"Commestibili","Extração":"Estrazione","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Olio","Óleo CBD Isolado":"Olio CBD Isolato","Óleo Full Spectrum":"Olio Spettro completo","Óleo CBG":"Olio CBG","Charutos San Juan":"Sigari San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"Diamonds THC/CBD","Gumes":"Gumes","Mel infusionado de THC":"Miele infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Cioccolato","Chicletes CBD e THC":"Gomme CBD e THC","Refrigerante infusionado (THC/CBD)":"Bibita infusionado (THC/CBD)","Chá infusionado THC":"Tè infusionado THC","Limonada infusionada THC":"Limonata infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Olio CBD Pet","Petiscos mastigáveis CBD":"Snack mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Balsamo tópico com canapa/CBD","Shampoo calmante com cânhamo":"Shampoo calmante com canapa","Canetas Hemp":"Penne Hemp","Camisetas":"T-shirt","Bonés (estilo trucker)":"Cappellini (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Rullatore","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolato • 30ml (demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Spettro completo • 30ml (demo)","CBG • Isolado • 30ml (demo)":"CBG • Isolato • 30ml (demo)","Configuração por peso e strain (demo)":"Configurazione per peso e strain (demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Sigaretta pre-rollata • 01g • strain selezionabile (demo)","Extração (demo) • strain selecionável":"Estrazione (demo) • strain selezionabile","Comestível (demo) • sabores • 50g / 100g":"Commestibile (demo) • gusti • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Commestibile (demo) • THC (dove consentito) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Commestibile (demo) • THC (dove consentito) • 100g","Comestível (demo) • CBD/THC • 100g":"Commestibile (demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Commestibile (demo) • CBD/THC • unità","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Bevanda • THC/CBD • 330ml / 500ml (demo, dove consentito)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Bevanda • THC • 300ml / 500ml (demo, dove consentito)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Bevanda • THC • 400ml / 700ml (demo, dove consentito)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 tiri (demo, dove consentito)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (demo) • canapa/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (demo) • snacks • unità","Pet (demo) • uso tópico":"Pet (demo) • uso topico","Pet (demo) • higiene":"Pet (demo) • igiene","Acessório • escrita/coleção":"Accessorio • escrita/coleção","Acessório • apparel":"Accessorio • apparel","Acessório • boné":"Accessorio • boné","Acessório • diversos modelos":"Accessorio • diversos modelos","Acessório • enrolar":"Accessorio • enrolar","Acessório • papéis":"Accessorio • papéis","Acessório • tamanhos P / M / G":"Accessorio • tamanhos P / M / G","Acessório • vidro/acrílico":"Accessorio • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Variatà selezionabile • 5g / 10g (demo, dove consentito)","Bolador (demo). Ajuda a manter consistência na montagem.":"Rullatore (demo). Aiuta a mantenere la consistenza nel rollaggio.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bong (demo). Usalo in sicurezza e cura la pulizia.","Bonés trucker (demo). Leve e ventilado.":"Cappellini trucker (demo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Balsamo topico (demo). Opzione comune nelle linee pet con canapa: controlla la composizione e fai una prova su una piccola area.","Camisetas (demo). Modelagem básica e minimalista.":"T-shirt (demo). Vestibilità base e minimalista.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Penne Hemp (demo). Un tocco di stile per tutti i giorni.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"Sigari San Juan (demo). Seleziona peso e strain. Dove consentito, l’esperienza include spesso aroma e rituale. Usalo in modo responsabile.","Chicletes (demo). Discretos e fáceis de dosar.":"Gomme (demo). Discrete e facili da dosare.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Cioccolato (demo). Un classico; ricorda che l’assorbimento può essere più lento.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"Tè infuso al THC (demo). Varia gusto e volume. Verifica sempre la legalità locale e consuma in modo responsabile.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinder (demo). Una macinatura uniforme aiuta la consistenza e riduce gli sprechi.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Estrazioni (demo). In genere più concentrate: inizia con poco e usale in modo responsabile (secondo la normativa locale).","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gommose (demo). Pratiche e discrete. I commestibili possono impiegare più tempo a fare effetto: vai con calma.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (demo). Pre-rollato da 01g con selezione di strain. Preferisci ambienti sicuri e dosi più piccole.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"Limonata infusa al THC (demo). Seleziona volume e ghiaccio. Verifica sempre la legalità locale e consuma in modo responsabile.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Burro tartufato (demo). Ideale per ricette: il controllo della dose è essenziale.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Miele infuso (demo). Perfetto con tè e ricette: attenzione alla dose.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"Snack CBD (demo). Snack masticabili per routine/allenamento. Verifica ingredienti ed etichettatura secondo la tua giurisdizione.","Piteiras (demo). Conforto e melhor fluxo.":"Filtri (demo). Più comfort e miglior flusso.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Bibita infusa (demo). Seleziona cannabinoide, volume e gusto. Verifica sempre la legalità locale e consuma in modo responsabile.","Sedas (demo). Papéis clássicos e práticos.":"Cartine (demo). Classiche e pratiche.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Shampoo alla canapa (demo). Prodotto per l’igiene con focus benessere: scegli formule delicate adatte agli animali.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"Vape THC (demo). Seleziona numero di tiri e gusto. Verifica sempre la legalità locale e usalo in modo responsabile.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"Olio CBD Isolato (demo). Punta su un singolo cannabinoide, con un profilo più neutro. Conferma la legalità locale e usalo in modo responsabile.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"Olio CBD per animali (demo). Comune dove consentito; evita affermazioni mediche e segui le indicazioni veterinarie.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"Olio CBG (demo). Di solito formulato con cannabigerolo. Controlla etichetta e conformità/legalità locale.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Olio Full Spectrum (demo). Di solito include più composti della canapa (anche terpeni), che possono cambiare aroma ed esperienza. Controlla etichetta e conformità.","Isolado":"Isolato","THC (onde permitido)":"THC (dove consentito)","100 puxadas":"100 tiri","1000 puxadas":"1000 tiri","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Bianco","Branca":"Bianca","Preto":"Nero","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Vetro","Acrílico":"Acrilico","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Fondente","Ao leite":"Al latte","Camomila":"Camomilla","Gengibre":"Zenzero","Hortelã":"Menta","Menta":"Menta","Mint":"Mint","Morango":"Fragola","Melancia":"Anguria","Uva":"Uva","Laranja":"Arancia","Limão":"Limone","Tangerina":"Mandarino","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"de":{"footer_company":"Hemp Store S.A.","footer_group":"Gruppe JP. DIETERICH","privacy_title":"Datenschutzerklärung","legal_model_note":"Informationsdokument (Vorlage). Für den realen Einsatz mit Ihrem Anwalt anpassen.","privacy_li1":"Wir können Basisdaten für Warenkorb, Login (Demo) und Spracheinstellungen erfassen.","privacy_li2":"Daten können lokal in Ihrem Browser (localStorage) gespeichert werden, um das Erlebnis zu verbessern.","privacy_li3":"Sie können Löschung/Anpassungen gemäß geltendem Recht (LGPD) anfordern.","privacy_li4":"Wir verkaufen Ihre Daten nicht. Wir nutzen sie nur für Betrieb und Verbesserung des Dienstes.","terms_title":"Nutzungsbedingungen","terms_li1":"Mit dem Zugriff auf diese Website stimmen Sie diesen Bedingungen und dem geltenden Recht zu.","terms_li2":"Die Informationen hier dienen der Orientierung und können ohne Vorankündigung geändert werden.","terms_li3":"Missbräuchliche Markennutzung, vollständiges Kopieren von Inhalten und exzessives Scraping sind verboten.","terms_li4":"Käufe und Zahlungen folgen den im Checkout angezeigten Bedingungen.","terms_li5":"Bei Fragen nutzen Sie bitte die Kontaktseite.","cookies_title":"Cookie-Richtlinie","cookies_li1":"Diese Website kann lokalen Speicher/Cookies verwenden, um Sprache und Warenkorb zu speichern.","cookies_li2":"Sie können Browserdaten jederzeit löschen, um Einstellungen zu entfernen.","cookies_li3":"Analytics-/Marketing-Tools sollten nur mit Einwilligung aktiviert werden (falls zutreffend).","lgpd_title":"LGPD (Betroffenenrechte)","lgpd_li1":"Sie können anfordern: Auskunft, Berichtigung, Datenübertragbarkeit, Widerruf der Einwilligung und Löschung.","lgpd_li2":"Kanal: privacidade@hempstore.com.br (ersetzen Sie dies durch Ihre echte E-Mail).","lgpd_li3":"Rechtsgrundlage und Aufbewahrung hängen von Datentyp sowie regulatorischen/steuerlichen Pflichten ab.","institutional":"institutional","back_simple":"Zurück","notice":"notice","notice_sub":"Institutioneller Inhalt. Betrieb und Portfolio unterliegen den geltenden Gesetzen und Normen.","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"F&E, Qualität und Lieferkette für Hemp- und medizinische Cannabis-Derivate – mit Fokus auf Compliance und Rückverfolgbarkeit.","hoc_btn_solutions":"Lösungen ansehen","hoc_btn_store":"Zum Shop (Hemp Store)","hoc_areas_title":"Hauptbereiche","hoc_badge_rd":"F&E","hoc_card_rd_title":"Forschung & Entwicklung","hoc_card_rd_sub":"Rahmen für Spezifikationen, Stabilität, Dokumentation und Innovation.","hoc_badge_quality":"Qualität","hoc_card_quality_title":"Qualität & Rückverfolgbarkeit","hoc_card_quality_sub":"Leitlinien zu Chain of Custody, Chargenkontrolle und Konsistenz.","hoc_badge_compliance":"Compliance","hoc_card_compliance_title":"Governance & Compliance","hoc_card_compliance_sub":"Interne Richtlinien und Einhaltung anwendbarer Normen (wenn erforderlich).","hoc_contact_title":"B2B-Kontakt","hoc_contact_sub":"Sprechen Sie mit dem Vertriebs-/Technikteam über Partnerschaften, Distribution und Portfolioentwicklung.","label_email":"E-Mail:","label_partnerships":"Partnerschaften:","hoc_quick_msg":"Kurznachricht","label_name":"Name","label_message":"Nachricht","send":"send","hoc_form_demo":"Demo-Formular. Fordern Sie eine echte Versand-Integration an.","sol_title":"Lösungen (B2B)","sol_sub":"Module für Qualität, Dokumentation und Lieferkette – im gleichen visuellen Stil der Hemp Store.","sol_btn_compliance":"F&E + Compliance","sol_deliver_title":"Was wir liefern","sol_badge_docs":"Docs","sol_docs_title":"Spezifikationen & Dokumentation","sol_docs_sub":"Datenblätter, Kennzeichnungsanforderungen, interne Standards und Konsistenz.","sol_badge_scm":"SCM","sol_scm_title":"Supply Chain & Partner","sol_scm_sub":"Lieferantenauswahl, Standardisierung und Rückverfolgbarkeit.","sol_badge_brand":"Brand","sol_brand_title":"Portfoliostrategie","sol_brand_sub":"Linienarchitektur und Distributionsleitfäden.","sol_integration_title":"Integration mit Hemp Store","sol_integration_sub":"Der B2C-Betrieb findet in der Hemp Store S.A. (E-Commerce) statt. Die Hemp Oil Company strukturiert Lieferkette und F&E.","sol_btn_store_products":"Produkte im Shop ansehen","comp_title":"F&E + Compliance","comp_sub":"Institutioneller Hub für interne Standards, Qualität und Rückverfolgbarkeit – klar und objektiv formuliert.","comp_btn_talk":"Mit dem Team sprechen","comp_pillars":"Säulen","comp_badge_sop":"SOP","comp_sop_title":"Verfahren und Standards","comp_sop_sub":"Dokumentation mit Fokus auf Konsistenz und kontinuierliche Verbesserung.","comp_badge_qa":"QA","comp_qa_title":"Qualitätskontrolle","comp_qa_sub":"Richtlinien für Chargenkontrolle und Aufzeichnungen.","comp_badge_legal":"Rechtliches","comp_legal_title":"Konformität","comp_legal_sub":"Einhaltung der anwendbaren Normen je nach Umfang/Regulierung.","Acessórios":"Zubehör","Bebida":"Getränk","Charutaria":"Zigarren","Comestíveis":"Edibles","Extração":"Extrakt","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"Öl","Óleo CBD Isolado":"Öl CBD Isolat","Óleo Full Spectrum":"Öl Vollspektrum","Óleo CBG":"Öl CBG","Charutos San Juan":"Zigarren San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash (ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"Diamonds THC/CBD","Gumes":"Gumes","Mel infusionado de THC":"Honig infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"Schokolade","Chicletes CBD e THC":"Kaugummis CBD e THC","Refrigerante infusionado (THC/CBD)":"Limo infusionado (THC/CBD)","Chá infusionado THC":"Tee infusionado THC","Limonada infusionada THC":"Limonade infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"Öl CBD Pet","Petiscos mastigáveis CBD":"Snacks mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"Balsam tópico com Hanf/CBD","Shampoo calmante com cânhamo":"Shampoo calmante com Hanf","Canetas Hemp":"Stifte Hemp","Camisetas":"T-Shirts","Bonés (estilo trucker)":"Caps (estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"Roller","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • Isolat • 30ml (Demo)","CBD • Full Spectrum • 30ml (demo)":"CBD • Vollspektrum • 30ml (Demo)","CBG • Isolado • 30ml (demo)":"CBG • Isolat • 30ml (Demo)","Configuração por peso e strain (demo)":"Konfiguration nach Gewicht und Strain (Demo)","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"Vorgerollte Zigarette • 01g • Strain wählbar (Demo)","Extração (demo) • strain selecionável":"Extrakt (Demo) • Strain wählbar","Comestível (demo) • sabores • 50g / 100g":"Edible (Demo) • Geschmacksrichtungen • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"Edible (Demo) • THC (wo erlaubt) • 100ml","Comestível (demo) • THC (onde permitido) • 100g":"Edible (Demo) • THC (wo erlaubt) • 100g","Comestível (demo) • CBD/THC • 100g":"Edible (Demo) • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"Edible (Demo) • CBD/THC • Einheiten","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"Getränk • THC/CBD • 330ml / 500ml (Demo, wo erlaubt)","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"Getränk • THC • 300ml / 500ml (Demo, wo erlaubt)","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"Getränk • THC • 400ml / 700ml (Demo, wo erlaubt)","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 Züge (Demo, wo erlaubt)","Pet (demo) • cânhamo/CBD • 30ml":"Pet (Demo) • Hanf/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet (Demo) • snacks • Einheiten","Pet (demo) • uso tópico":"Pet (Demo) • topische Anwendung","Pet (demo) • higiene":"Pet (Demo) • Hygiene","Acessório • escrita/coleção":"Zubehör • escrita/coleção","Acessório • apparel":"Zubehör • apparel","Acessório • boné":"Zubehör • boné","Acessório • diversos modelos":"Zubehör • diversos modelos","Acessório • enrolar":"Zubehör • enrolar","Acessório • papéis":"Zubehör • papéis","Acessório • tamanhos P / M / G":"Zubehör • tamanhos P / M / G","Acessório • vidro/acrílico":"Zubehör • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"Variante wählbar • 5g / 10g (Demo, wo erlaubt)","Bolador (demo). Ajuda a manter consistência na montagem.":"Roller (Demo). Hilft, beim Drehen eine gleichmäßige Konsistenz zu erreichen.","Bongs (demo). Utilize com segurança e cuide da limpeza.":"Bongs (Demo). Sicher verwenden und auf Sauberkeit achten.","Bonés trucker (demo). Leve e ventilado.":"Caps trucker (Demo). Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"Topischer Balsam (Demo). Gängige Option in Pet-Linien mit Hanf — Zusammensetzung prüfen und an kleiner Stelle testen.","Camisetas (demo). Modelagem básica e minimalista.":"T-Shirts (Demo). Basic- und minimalistischer Schnitt.","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hemp-Stifte (Demo). Ein Hauch Stil für den Alltag.","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San-Juan-Zigarren (Demo). Gewicht und Strain wählen. Wo erlaubt, geht es oft um Aroma und Ritual. Verantwortungsvoll verwenden.","Chicletes (demo). Discretos e fáceis de dosar.":"Kaugummis (Demo). Diskret und leicht zu dosieren.","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"Schokolade (Demo). Eine klassische Form; bedenken Sie, dass die Aufnahme langsamer sein kann.","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infundierter Tee (Demo). Geschmack und Menge wählen. Lokale Rechtslage prüfen und verantwortungsvoll konsumieren.","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"Grinder (Demo). Gleichmäßiges Mahlen verbessert die Konsistenz und reduziert Verschwendung.","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"Extrakte (Demo). In der Regel konzentrierter – niedrig dosieren und verantwortungsvoll verwenden (gemäß lokaler Gesetzgebung).","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"Gummis (Demo). Praktisch und diskret. Edibles wirken oft später – langsam angehen.","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos (Demo). 01g vorgerollt mit Strain-Auswahl. Bevorzugen Sie sichere Umgebungen und kleinere Dosen.","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC-infundierte Limonade (Demo). Menge und Eis wählen. Lokale Rechtslage prüfen und verantwortungsvoll konsumieren.","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"Trüffelbutter (Demo). Ideal für Rezepte – Dosiskontrolle ist entscheidend.","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"Infundierter Honig (Demo). Passt zu Tee und Rezepten – achten Sie auf die Dosierung.","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBD-Snacks (Demo). Kaubare Snacks für Routine/Training. Zutaten und Kennzeichnung gemäß Ihrer Rechtsordnung prüfen.","Piteiras (demo). Conforto e melhor fluxo.":"Mundstücke (Demo). Mehr Komfort und besserer Zug.","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"Infundierte Limo (Demo). Cannabinoid, Menge und Geschmack wählen. Lokale Rechtslage prüfen und verantwortungsvoll konsumieren.","Sedas (demo). Papéis clássicos e práticos.":"Papers (Demo). Klassisch und praktisch.","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"Hanf-Shampoo (Demo). Hygieneprodukt mit Wellness-Fokus – milde, für Haustiere geeignete Formeln wählen.","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THC-Vape (Demo). Anzahl der Züge und Geschmack wählen. Lokale Rechtslage prüfen und verantwortungsvoll verwenden.","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBD-Isolat-Öl (Demo). Fokussiert auf ein Hauptcannabinoid, mit neutralerem Profil. Lokale Rechtslage prüfen und verantwortungsvoll verwenden.","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"CBD-Öl für Haustiere (Demo). Häufig dort, wo erlaubt; vermeiden Sie medizinische Aussagen und folgen Sie tierärztlicher Empfehlung.","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBG-Öl (Demo). Meist mit Cannabigerol formuliert. Etikett und Konformität/Rechtslage prüfen.","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"Vollspektrum-Öl (Demo). Enthält meist mehr Hanfstoffe (inkl. Terpene), was Aroma und Erlebnis verändern kann. Etikett und Konformität prüfen.","Isolado":"Isolat","THC (onde permitido)":"THC (wo erlaubt)","100 puxadas":"100 Züge","1000 puxadas":"1000 Züge","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"Weiß","Branca":"Weiß","Preto":"Schwarz","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"Glas","Acrílico":"Acryl","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"Bitter","Ao leite":"Vollmilch","Camomila":"Kamille","Gengibre":"Ingwer","Hortelã":"Minze","Menta":"Menta","Mint":"Mint","Morango":"Erdbeere","Melancia":"Wassermelone","Uva":"Traube","Laranja":"Orange","Limão":"Zitrone","Tangerina":"Mandarine","Manga":"Mango","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"ja":{"footer_company":"Hemp Store S.A.","footer_group":"JP. DIETERICH グループ","privacy_title":"プライバシーポリシー","legal_model_note":"参考用ドキュメント（テンプレート）。実運用は弁護士と調整してください。","privacy_li1":"カート、ログイン（デモ）、言語設定のために基本情報を取得する場合があります。","privacy_li2":"体験向上のため、データはブラウザ（localStorage）にローカル保存される場合があります。","privacy_li3":"適用法（LGPD）に基づき削除／修正を依頼できます。","privacy_li4":"データを販売しません。運用と改善のためにのみ使用します。","terms_title":"利用規約","terms_li1":"本サイトにアクセスすると、これらの条件および適用法令に同意したものとみなされます。","terms_li2":"掲載情報は参考であり、予告なく変更される場合があります。","terms_li3":"ブランドの不正使用、内容の無断複製、過度なスクレイピングは禁止です。","terms_li4":"購入と支払いはチェックアウトに表示される条件に従います。","terms_li5":"不明点はお問い合わせページをご利用ください。","cookies_title":"Cookieポリシー","cookies_li1":"本サイトは言語とカート保持のためにローカルストレージ／Cookieを使用する場合があります。","cookies_li2":"ブラウザのデータをいつでも削除して設定をリセットできます。","cookies_li3":"分析／マーケティングツールは同意がある場合のみ有効化してください（該当する場合）。","lgpd_title":"LGPD（本人の権利）","lgpd_li1":"請求できる内容：開示、訂正、移転（ポータビリティ）、同意撤回、削除。","lgpd_li2":"窓口：privacidade@hempstore.com.br（実際のメールに置き換えてください）。","lgpd_li3":"法的根拠と保存期間はデータ種別および規制／税務義務により異なります。","institutional":"institutional","back_simple":"戻る","notice":"notice","notice_sub":"機関向け内容。運用とポートフォリオは現行法令・基準に従います。","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"ヘンプおよび医療用カンナビス由来製品のR&D、品質、サプライチェーン。コンプライアンスとトレーサビリティ重視。","hoc_btn_solutions":"ソリューションを見る","hoc_btn_store":"ストアへ（Hemp Store）","hoc_areas_title":"主な領域","hoc_badge_rd":"R&D","hoc_card_rd_title":"研究開発","hoc_card_rd_sub":"仕様、安定性、ドキュメント、イノベーションの枠組み。","hoc_badge_quality":"品質","hoc_card_quality_title":"品質とトレーサビリティ","hoc_card_quality_sub":"チェーン・オブ・カストディ、ロット管理、一貫性のガイドライン。","hoc_badge_compliance":"コンプライアンス","hoc_card_compliance_title":"ガバナンスとコンプライアンス","hoc_card_compliance_sub":"社内ポリシーと適用される基準への適合（必要に応じて）。","hoc_contact_title":"B2Bお問い合わせ","hoc_contact_sub":"パートナーシップ、流通、ポートフォリオ開発について営業／技術チームにご相談ください。","label_email":"メール:","label_partnerships":"パートナーシップ:","hoc_quick_msg":"クイックメッセージ","label_name":"お名前","label_message":"メッセージ","send":"send","hoc_form_demo":"デモフォーム。実運用の送信連携をご依頼ください。","sol_title":"ソリューション（B2B）","sol_sub":"品質、ドキュメント、サプライチェーン向けモジュール。Hemp Storeと同じビジュアルスタイルを維持。","sol_btn_compliance":"R&D + コンプライアンス","sol_deliver_title":"提供内容","sol_badge_docs":"ドキュメント","sol_docs_title":"仕様とドキュメント","sol_docs_sub":"仕様書、表示要件、社内標準、一貫性。","sol_badge_scm":"SCM","sol_scm_title":"サプライチェーンとパートナー","sol_scm_sub":"サプライヤー選定、標準化、トレーサビリティ。","sol_badge_brand":"ブランド","sol_brand_title":"ポートフォリオ戦略","sol_brand_sub":"ライン設計と流通ガイド。","sol_integration_title":"Hemp Storeとの連携","sol_integration_sub":"B2C運用はHemp Store S.A.（EC）で行います。Hemp Oil CompanyがサプライチェーンとR&Dを整備します。","sol_btn_store_products":"ストアの商品を見る","comp_title":"R&D + コンプライアンス","comp_sub":"社内標準、品質、トレーサビリティのためのインスティテューショナル・ハブ。明確で客観的な表現。","comp_btn_talk":"チームに相談","comp_pillars":"柱","comp_badge_sop":"SOP","comp_sop_title":"手順と標準","comp_sop_sub":"一貫性と継続的改善に向けたドキュメント。","comp_badge_qa":"QA","comp_qa_title":"品質管理","comp_qa_sub":"ロット管理と記録のためのガイドライン。","comp_badge_legal":"法務","comp_legal_title":"コンプライアンス","comp_legal_sub":"範囲／規制に応じて適用される基準への適合。","Acessórios":"アクセサリー","Bebida":"ドリンク","Charutaria":"葉巻","Comestíveis":"エディブル","Extração":"エキス","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"オイル","Óleo CBD Isolado":"オイル CBD アイソレート","Óleo Full Spectrum":"オイル フルスペクトラム","Óleo CBG":"オイル CBG","Charutos San Juan":"葉巻 San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash（ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"Diamonds THC/CBD","Gumes":"Gumes","Mel infusionado de THC":"ハチミツ infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"チョコレート","Chicletes CBD e THC":"ガム CBD e THC","Refrigerante infusionado (THC/CBD)":"ソーダ infusionado（THC/CBD)","Chá infusionado THC":"お茶 infusionado THC","Limonada infusionada THC":"レモネード infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"オイル CBD Pet","Petiscos mastigáveis CBD":"おやつ mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"バーム tópico com ヘンプ/CBD","Shampoo calmante com cânhamo":"シャンプー calmante com ヘンプ","Canetas Hemp":"ペン Hemp","Camisetas":"Tシャツ","Bonés (estilo trucker)":"キャップ（estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"ローラー","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • アイソレート • 30ml （デモ）","CBD • Full Spectrum • 30ml (demo)":"CBD • フルスペクトラム • 30ml （デモ）","CBG • Isolado • 30ml (demo)":"CBG • アイソレート • 30ml （デモ）","Configuração por peso e strain (demo)":"重量とストレインでカスタマイズ（デモ）","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"プレロール • 01g • ストレイン選択可 （デモ）","Extração (demo) • strain selecionável":"エキス （デモ） • ストレイン選択可","Comestível (demo) • sabores • 50g / 100g":"エディブル （デモ） • フレーバー • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"エディブル （デモ） • THC（許可されている地域のみ）• 100ml","Comestível (demo) • THC (onde permitido) • 100g":"エディブル （デモ） • THC（許可されている地域のみ）• 100g","Comestível (demo) • CBD/THC • 100g":"エディブル （デモ） • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"エディブル （デモ） • CBD/THC • 個数","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"ドリンク • THC/CBD • 330ml / 500ml （デモ：許可されている地域のみ）","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"ドリンク • THC • 300ml / 500ml （デモ：許可されている地域のみ）","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"ドリンク • THC • 400ml / 700ml （デモ：許可されている地域のみ）","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 吸引回数 （デモ：許可されている地域のみ）","Pet (demo) • cânhamo/CBD • 30ml":"Pet （デモ） • ヘンプ/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet （デモ） • snacks • 個数","Pet (demo) • uso tópico":"Pet （デモ） • 外用","Pet (demo) • higiene":"Pet （デモ） • 衛生","Acessório • escrita/coleção":"アクセサリー • escrita/coleção","Acessório • apparel":"アクセサリー • apparel","Acessório • boné":"アクセサリー • boné","Acessório • diversos modelos":"アクセサリー • diversos modelos","Acessório • enrolar":"アクセサリー • enrolar","Acessório • papéis":"アクセサリー • papéis","Acessório • tamanhos P / M / G":"アクセサリー • tamanhos P / M / G","Acessório • vidro/acrílico":"アクセサリー • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"バリエーション選択可 • 5g / 10g （デモ：許可されている地域のみ）","Bolador (demo). Ajuda a manter consistência na montagem.":"ローラー（デモ）。巻き上げの仕上がりを一定に保つのに役立ちます。","Bongs (demo). Utilize com segurança e cuide da limpeza.":"ボング（デモ）。安全に使用し、清潔に保ってください。","Bonés trucker (demo). Leve e ventilado.":"キャップ trucker （デモ）. Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"外用バーム（デモ）。ヘンプ配合のペット向け製品でよくあるタイプです。成分を確認し、狭い範囲で試してください。","Camisetas (demo). Modelagem básica e minimalista.":"Tシャツ（デモ）。ベーシックでミニマルなシルエット。","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hempペン（デモ）。日常にさりげないスタイルを。","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San Juan 葉巻（デモ）。重量とストレインを選択。許可されている地域では、香りと儀式性を楽しむ体験になりがちです。責任を持って使用してください。","Chicletes (demo). Discretos e fáceis de dosar.":"ガム（デモ）。目立たず、量を調整しやすい。","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"チョコレート（デモ）。定番の形ですが、吸収は遅くなる場合があります。","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THCインフューズドティー（デモ）。フレーバーと量を選択。必ず現地の法令を確認し、責任を持って摂取してください。","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"グラインダー（デモ）。均一に挽くことで仕上がりが安定し、無駄を減らします。","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"エキス（デモ）。一般的に高濃度です。少量から始め、現地の法令に従って責任を持って使用してください。","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"グミ（デモ）。手軽で目立ちません。エディブルは効くまで時間がかかることがあるので、ゆっくり。","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos（デモ）。01gのプレロールでストレインを選べます。安全な環境と少量からを推奨します。","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THCインフューズドレモネード（デモ）。量と氷を選択。必ず現地の法令を確認し、責任を持って摂取してください。","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"トリュフバター（デモ）。レシピに最適ですが、用量管理が重要です。","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"インフューズドハチミツ（デモ）。お茶やレシピに合いますが、用量に注意。","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBDおやつ（デモ）。日常／トレーニング向けの噛めるスナック。原材料と表示が地域の規制に適合しているか確認してください。","Piteiras (demo). Conforto e melhor fluxo.":"マウスピース（デモ）。快適さとフロー向上。","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"インフューズドソーダ（デモ）。カンナビノイド、量、フレーバーを選択。必ず現地の法令を確認し、責任を持って摂取してください。","Sedas (demo). Papéis clássicos e práticos.":"ペーパー（デモ）。クラシックで使いやすい。","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"ヘンプシャンプー（デモ）。ウェルネス志向の衛生用品。ペットに合うやさしい処方を選んでください。","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THCベイプ（デモ）。吸引回数とフレーバーを選択。必ず現地の法令を確認し、責任を持って使用してください。","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBDアイソレートオイル（デモ）。主成分のカンナビノイドに焦点を当て、よりニュートラルなプロファイルです。必ず現地の法令を確認し、責任を持って使用してください。","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"ペット用CBDオイル（デモ）。許可されている市場で一般的です。医療的な断定は避け、獣医の指導に従ってください。","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBGオイル（デモ）。通常カンナビゲロール配合。ラベル表示と現地での適法性／適合性を確認してください。","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"フルスペクトラムオイル（デモ）。ヘンプ由来成分（テルペン含む）がより多く含まれることが多く、香りや体験が変わる場合があります。ラベル表示と適合性を確認してください。","Isolado":"アイソレート","THC (onde permitido)":"THC（許可されている地域のみ)","100 puxadas":"100 吸引回数","1000 puxadas":"1000 吸引回数","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"白","Branca":"白","Preto":"黒","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"ガラス","Acrílico":"アクリル","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"ビター","Ao leite":"ミルク","Camomila":"カモミール","Gengibre":"ジンジャー","Hortelã":"ミント","Menta":"Menta","Mint":"Mint","Morango":"いちご","Melancia":"スイカ","Uva":"ぶどう","Laranja":"オレンジ","Limão":"レモン","Tangerina":"みかん","Manga":"マンゴー","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"},"zh":{"footer_company":"Hemp Store S.A.","footer_group":"JP. DIETERICH 集团","privacy_title":"隐私政策","legal_model_note":"信息文档（模板）。实际使用请与律师调整。","privacy_li1":"我们可能收集基本数据用于购物车、登录（演示）与语言偏好。","privacy_li2":"为提升体验，数据可能存储在浏览器本地（localStorage）。","privacy_li3":"您可依据适用法律（LGPD）申请删除/调整。","privacy_li4":"我们不出售您的数据，仅用于运营与改进服务。","terms_title":"使用条款","terms_li1":"访问本网站即表示您同意这些条款及适用法律法规。","terms_li2":"此处信息仅供参考，可能随时变更且不另行通知。","terms_li3":"禁止不当使用品牌、完整复制内容以及滥用式抓取。","terms_li4":"购买与支付遵循结账页面所示条件。","terms_li5":"如有疑问，请使用联系页面。","cookies_title":"Cookie 政策","cookies_li1":"本网站可能使用本地存储/Cookie 来保存语言与购物车。","cookies_li2":"您可随时清除浏览器数据以移除偏好设置。","cookies_li3":"分析/营销工具仅应在获得同意后启用（如适用）。","lgpd_title":"LGPD（主体权利）","lgpd_li1":"您可申请：访问、更正、可携带、撤回同意与删除。","lgpd_li2":"渠道：privacidade@hempstore.com.br（请替换为真实邮箱）。","lgpd_li3":"法律依据与保留期限取决于数据类型及监管/税务义务。","institutional":"institutional","back_simple":"返回","notice":"notice","notice_sub":"机构内容。运营与产品组合受现行法律法规及标准约束。","hoc_title":"Hemp Oil Company S.A.","hoc_hero_sub":"面向 hemp 与医用大麻衍生产品的研发、质量与供应链，重点关注合规与可追溯性。","hoc_btn_solutions":"查看解决方案","hoc_btn_store":"前往商店（Hemp Store）","hoc_areas_title":"主要领域","hoc_badge_rd":"研发","hoc_card_rd_title":"研发","hoc_card_rd_sub":"用于规格、稳定性、文档与创新的框架。","hoc_badge_quality":"质量","hoc_card_quality_title":"质量与可追溯","hoc_card_quality_sub":"监管链、批次控制与一致性指南。","hoc_badge_compliance":"合规","hoc_card_compliance_title":"治理与合规","hoc_card_compliance_sub":"内部政策与适用规范的合规（如需）。","hoc_contact_title":"B2B 联系方式","hoc_contact_sub":"如需合作、分销与产品组合开发，请联系商务/技术团队。","label_email":"邮箱：","label_partnerships":"合作：","hoc_quick_msg":"快速留言","label_name":"姓名","label_message":"留言","send":"send","hoc_form_demo":"演示表单。请申请真实发送/集成。","sol_title":"解决方案（B2B）","sol_sub":"用于质量、文档与供应链的模块，同时保持 Hemp Store 的视觉风格。","sol_btn_compliance":"研发 + 合规","sol_deliver_title":"交付内容","sol_badge_docs":"文档","sol_docs_title":"规格与文档","sol_docs_sub":"技术资料、标签要求、内部标准与一致性。","sol_badge_scm":"SCM","sol_scm_title":"供应链与合作伙伴","sol_scm_sub":"供应商甄选、标准化与可追溯。","sol_badge_brand":"品牌","sol_brand_title":"产品组合策略","sol_brand_sub":"产品线架构与分销指南。","sol_integration_title":"与 Hemp Store 集成","sol_integration_sub":"B2C 运营在 Hemp Store S.A.（电商）进行。Hemp Oil Company 负责供应链与研发架构。","sol_btn_store_products":"在商店查看产品","comp_title":"研发 + 合规","comp_sub":"面向内部标准、质量与可追溯性的机构信息中心，表达清晰客观。","comp_btn_talk":"联系团队","comp_pillars":"支柱","comp_badge_sop":"SOP","comp_sop_title":"流程与标准","comp_sop_sub":"面向一致性与持续改进的文档体系。","comp_badge_qa":"QA","comp_qa_title":"质量控制","comp_qa_sub":"批次控制与记录的指南。","comp_badge_legal":"法务","comp_legal_title":"合规","comp_legal_sub":"根据范围/监管要求，符合适用规范。","Acessórios":"配件","Bebida":"饮料","Charutaria":"雪茄","Comestíveis":"可食用","Extração":"提取物","Pets":"Pets","Strain":"Strain","Vape":"Vape","Óleo":"油","Óleo CBD Isolado":"油 CBD 分离型","Óleo Full Spectrum":"油 全谱","Óleo CBG":"油 CBG","Charutos San Juan":"雪茄 San Juan","Juanitos • Pré-enrolado 01g":"Juanitos • Pré-enrolado 01g","Dry":"Dry","Bubble Hash (ice)":"Bubble Hash（ice)","Rosin":"Rosin","Live Rosin":"Live Rosin","Diamonds THC/CBD":"Diamonds THC/CBD","Gumes":"Gumes","Mel infusionado de THC":"蜂蜜 infusionado de THC","Manteiga Trufada de THC":"Manteiga Trufada de THC","Chocolate":"巧克力","Chicletes CBD e THC":"口香糖 CBD e THC","Refrigerante infusionado (THC/CBD)":"汽水 infusionado（THC/CBD)","Chá infusionado THC":"茶 infusionado THC","Limonada infusionada THC":"柠檬水 infusionada THC","Vape THC":"Vape THC","Óleo CBD Pet":"油 CBD Pet","Petiscos mastigáveis CBD":"零食 mastigáveis CBD","Bálsamo tópico com cânhamo/CBD":"香膏 tópico com 汉麻/CBD","Shampoo calmante com cânhamo":"洗发水 calmante com 汉麻","Canetas Hemp":"笔 Hemp","Camisetas":"T恤","Bonés (estilo trucker)":"帽子（estilo trucker)","Dichavadores":"Dichavadores","Piteiras":"Piteiras","Sedas":"Sedas","Bolador":"卷制器","Bongs":"Bongs","CBD • Isolado • 30ml (demo)":"CBD • 分离型 • 30ml （演示）","CBD • Full Spectrum • 30ml (demo)":"CBD • 全谱 • 30ml （演示）","CBG • Isolado • 30ml (demo)":"CBG • 分离型 • 30ml （演示）","Configuração por peso e strain (demo)":"按重量与品种配置（演示）","Cigarro pré-enrolado • 01g • strain selecionável (demo)":"预卷香烟 • 01g • 品种可选 （演示）","Extração (demo) • strain selecionável":"提取物 （演示） • 品种可选","Comestível (demo) • sabores • 50g / 100g":"可食用 （演示） • 口味 • 50g / 100g","Comestível (demo) • THC (onde permitido) • 100ml":"可食用 （演示） • THC（仅在允许地区）• 100ml","Comestível (demo) • THC (onde permitido) • 100g":"可食用 （演示） • THC（仅在允许地区）• 100g","Comestível (demo) • CBD/THC • 100g":"可食用 （演示） • CBD/THC • 100g","Comestível (demo) • CBD/THC • unidades":"可食用 （演示） • CBD/THC • 单位","Bebida • THC/CBD • 330ml / 500ml (demo, onde permitido)":"饮料 • THC/CBD • 330ml / 500ml （演示：仅在允许地区）","Bebida • THC • 300ml / 500ml (demo, onde permitido)":"饮料 • THC • 300ml / 500ml （演示：仅在允许地区）","Bebida • THC • 400ml / 700ml (demo, onde permitido)":"饮料 • THC • 400ml / 700ml （演示：仅在允许地区）","Vape • THC • 100/1000 puxadas (demo, onde permitido)":"Vape • THC • 100/1000 吸口 （演示：仅在允许地区）","Pet (demo) • cânhamo/CBD • 30ml":"Pet （演示） • 汉麻/CBD • 30ml","Pet (demo) • snacks • unidades":"Pet （演示） • snacks • 单位","Pet (demo) • uso tópico":"Pet （演示） • 外用","Pet (demo) • higiene":"Pet （演示） • 清洁","Acessório • escrita/coleção":"配件 • escrita/coleção","Acessório • apparel":"配件 • apparel","Acessório • boné":"配件 • boné","Acessório • diversos modelos":"配件 • diversos modelos","Acessório • enrolar":"配件 • enrolar","Acessório • papéis":"配件 • papéis","Acessório • tamanhos P / M / G":"配件 • tamanhos P / M / G","Acessório • vidro/acrílico":"配件 • vidro/acrílico","Variedade selecionável • 5g / 10g (demo, onde permitido)":"可选品种 • 5g / 10g （演示：仅在允许地区）","Bolador (demo). Ajuda a manter consistência na montagem.":"卷制器（演示）。有助于在卷制时保持一致性。","Bongs (demo). Utilize com segurança e cuide da limpeza.":"水烟壶（演示）。请安全使用并注意清洁。","Bonés trucker (demo). Leve e ventilado.":"帽子 trucker （演示）. Leve e ventilado.","Bálsamo tópico (demo). Opção comum em linhas pet com cânhamo — sempre confira composição e faça teste em pequena área.":"外用香膏（演示）。常见于含大麻籽/汉麻成分的宠物产品线。请核对配方，并先在小范围测试。","Camisetas (demo). Modelagem básica e minimalista.":"T恤（演示）。基础简约版型。","Canetas Hemp (demo). Um toque de estilo para o dia a dia.":"Hemp 笔（演示）。为日常增添一点风格。","Charutos San Juan (demo). Selecione peso e strain. Em locais onde é permitido, a experiência costuma envolver aroma e ritual. Use com responsabilidade.":"San Juan 雪茄（演示）。请选择重量与品种。在允许地区，体验通常包含香气与仪式感。请负责任地使用。","Chicletes (demo). Discretos e fáceis de dosar.":"口香糖（演示）。低调且易于控制用量。","Chocolate (demo). Uma forma clássica de consumo; lembre que a absorção pode ser mais lenta.":"巧克力（演示）。经典食用形式；请注意吸收可能更慢。","Chá infusionado THC (demo). Varie sabor e volume. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC 浸泡茶饮（演示）。可选口味与容量。请务必确认当地合法性，并负责任地食用。","Dichavadores (demo). Moagem uniforme ajuda na consistência e reduz desperdício.":"研磨器（演示）。均匀研磨有助于一致性并减少浪费。","Extrações (demo). Em geral são mais concentradas — comece leve e use com responsabilidade (e conforme legislação local).":"提取物（演示）。通常更为浓缩：从少量开始，并在遵守当地法规的前提下负责任地使用。","Gumes (demo). Práticos e discretos. Comestíveis podem demorar mais para fazer efeito — vá com calma.":"软糖（演示）。方便低调。可食用产品起效可能更慢——请循序渐进。","Juanitos (demo). Pré-enrolado de 01g com seleção de strain. Prefira ambientes seguros e doses menores.":"Juanitos（演示）。01g 预卷，可选品种。建议在安全环境并从更小剂量开始。","Limonada infusionada THC (demo). Selecione volume e gelo. Sempre verifique a legalidade local e consuma com responsabilidade.":"THC 浸泡柠檬水（演示）。请选择容量与冰块。请务必确认当地合法性，并负责任地食用。","Manteiga trufada (demo). Ideal para receitas — controle de dose é essencial.":"松露黄油（演示）。适合做菜谱——剂量控制至关重要。","Mel infusionado (demo). Combina com chás e receitas — atenção à dose.":"浸泡蜂蜜（演示）。适合搭配茶饮与食谱——注意剂量。","Petiscos CBD (demo). Linha de snacks mastigáveis para rotina/treino. Verifique conformidade de ingredientes e rotulagem conforme sua jurisdição.":"CBD 零食（演示）。日常/训练用可咀嚼小食。请根据所在司法辖区核对配料与标签是否合规。","Piteiras (demo). Conforto e melhor fluxo.":"烟嘴（演示）。更舒适、气流更顺畅。","Refrigerante infusionado (demo). Selecione canabinoide, volume e sabor. Sempre verifique a legalidade local e consuma com responsabilidade.":"浸泡汽水（演示）。请选择大麻素、容量与口味。请务必确认当地合法性，并负责任地食用。","Sedas (demo). Papéis clássicos e práticos.":"卷纸（演示）。经典实用。","Shampoo com cânhamo (demo). Produto de higiene com apelo de bem-estar — escolha fórmulas suaves e adequadas para pets.":"汉麻洗发水（演示）。主打舒适健康的清洁产品——选择温和且适合宠物的配方。","Vape THC (demo). Selecione quantidade de puxadas e sabor. Sempre verifique a legalidade local e use com responsabilidade.":"THC 电子雾化（演示）。请选择吸口次数与口味。请务必确认当地合法性，并负责任地使用。","Óleo CBD Isolado (demo). Isolado foca em um canabinoide principal, com perfil mais neutro. Sempre confirme legalidade local e use com responsabilidade.":"CBD 分离型油（演示）。聚焦单一主要大麻素，风味/特性更中性。请务必确认当地合法性，并负责任地使用。","Óleo CBD pet (demo). Produtos pet à base de CBD (de cânhamo) são comuns em mercados onde permitido; evite alegações médicas e siga orientação veterinária.":"宠物 CBD 油（演示）。在允许的市场较常见；避免医疗宣称，并遵循兽医建议。","Óleo CBG (demo). Geralmente formulado com canabigerol. Confira o rótulo e a conformidade/legalidade local.":"CBG 油（演示）。通常含有大麻萜酚（CBG/ cannabigerol）。请查看标签并确认合规/当地合法性。","Óleo Full Spectrum (demo). Em geral traz um conjunto maior de compostos do cânhamo (incluindo terpenos), o que pode mudar aroma e experiência. Confira rótulo e conformidade.":"全谱油（演示）。通常含有更多汉麻成分（含萜烯），可能改变香气与体验。请查看标签并确认合规性。","Isolado":"分离型","THC (onde permitido)":"THC（仅在允许地区)","100 puxadas":"100 吸口","1000 puxadas":"1000 吸口","10 un.":"10 un.","30 un.":"30 un.","32 un.":"32 un.","50 un.":"50 un.","60 un.":"60 un.","01g":"01g","Com gelo":"Com gelo","Sem gelo":"Sem gelo","Pequeno":"Pequeno","Médio":"Médio","Grande":"Grande","Branco":"白色","Branca":"白色","Preto":"黑色","Preta":"Preta","Verde":"Verde","Madeira":"Madeira","Metal":"Metal","Vidro":"玻璃","Acrílico":"亚克力","Cão":"Cão","Gato":"Gato","Frango":"Frango","Salmão":"Salmão","Amargo":"苦味","Ao leite":"牛奶","Camomila":"洋甘菊","Gengibre":"姜","Hortelã":"薄荷","Menta":"Menta","Mint":"Mint","Morango":"草莓","Melancia":"西瓜","Uva":"葡萄","Laranja":"橙子","Limão":"柠檬","Tangerina":"橘子","Manga":"芒果","Bubblegum":"Bubblegum","Citrus":"Citrus","Cola":"Cola","P":"P","M":"M","G":"G","GG":"GG"}};
function t(key){
    const lang = getLang();
    return (
      (I18N_EXTRA[lang] && I18N_EXTRA[lang][key]) ||
      (I18N[lang] && I18N[lang][key]) ||
      (I18N_EXTRA.pt && I18N_EXTRA.pt[key]) ||
      (I18N.pt && I18N.pt[key]) ||
      key
    );
  }
  
  /* ---------- Currency & money formatting ---------- */
  const CUR = {
    key: "hemp_currency",
    ratesKey: "hemp_currency_rates",
    // All product/totals numbers in this demo are treated as USD base.
    base: "USD",
    list: [
      { code:"USD", label:"USD" },
      { code:"BRL", label:"BRL" },
      { code:"EUR", label:"EUR" },
      { code:"BTC", label:"BTC" },
      { code:"SATS", label:"SATS" },
    ]
  };

  function getCurrency(){
    const v = (localStorage.getItem(CUR.key) || "USD").toUpperCase();
    return CUR.list.some(c=>c.code===v) ? v : "USD";
  }
  function setCurrency(code){
    localStorage.setItem(CUR.key, String(code||"USD").toUpperCase());
  }

  function getRates(){
    const fallback = { USD:1, BRL_PER_USD:5.0, EUR_PER_USD:0.92, BTC_USD:45000 };
    try{
      const obj = JSON.parse(localStorage.getItem(CUR.ratesKey) || "null");
      if(!obj || typeof obj !== "object") return fallback;
      return {
        USD:1,
        BRL_PER_USD: Number(obj.BRL_PER_USD) || fallback.BRL_PER_USD,
        EUR_PER_USD: Number(obj.EUR_PER_USD) || fallback.EUR_PER_USD,
        BTC_USD: Number(obj.BTC_USD) || fallback.BTC_USD,
        updatedAt: obj.updatedAt || null
      };
    } catch { return fallback; }
  }
  function setRates(r){
    const cur = getRates();
    const next = {
      BRL_PER_USD: Number(r?.BRL_PER_USD ?? cur.BRL_PER_USD) || cur.BRL_PER_USD,
      EUR_PER_USD: Number(r?.EUR_PER_USD ?? cur.EUR_PER_USD) || cur.EUR_PER_USD,
      BTC_USD: Number(r?.BTC_USD ?? cur.BTC_USD) || cur.BTC_USD,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(CUR.ratesKey, JSON.stringify(next));
  }

  function formatNumber(v, {max=2, min=2}={}){
    const n = Number(v);
    if(!isFinite(n)) return "0";
    return n.toLocaleString(undefined, { minimumFractionDigits:min, maximumFractionDigits:max });
  }

  function money(vUsd){
    const code = getCurrency();
    const v = Number(vUsd);
    const r = getRates();
    if(!isFinite(v)) return "–";

    if(code === "USD"){
      try{ return new Intl.NumberFormat(undefined, {style:"currency", currency:"USD"}).format(v); }
      catch{ return `$${formatNumber(v,{max:2,min:2})}`; }
    }
    if(code === "BRL"){
      const brl = v * r.BRL_PER_USD;
      try{ return new Intl.NumberFormat(undefined, {style:"currency", currency:"BRL"}).format(brl); }
      catch{ return `R$ ${formatNumber(brl,{max:2,min:2})}`; }
    }
    if(code === "EUR"){
      const eur = v * r.EUR_PER_USD;
      try{ return new Intl.NumberFormat(undefined, {style:"currency", currency:"EUR"}).format(eur); }
      catch{ return `€ ${formatNumber(eur,{max:2,min:2})}`; }
    }
    if(code === "BTC"){
      const btc = r.BTC_USD > 0 ? (v / r.BTC_USD) : 0;
      return `₿ ${formatNumber(btc,{max:8,min:8})}`;
    }
    if(code === "SATS"){
      const btc = r.BTC_USD > 0 ? (v / r.BTC_USD) : 0;
      const sats = Math.round(btc * 1e8);
      return `${sats.toLocaleString(undefined)} sats`;
    }
    return `$${formatNumber(v,{max:2,min:2})}`;
  }

  // Add i18n strings without editing the giant dictionary blocks
  Object.assign(I18N.pt, {
    currency:"Moeda",
    currency_title:"Moeda e conversão",
    currency_sub:"Selecione a moeda para visualizar os valores do checkout.",
    currency_rates:"Taxas (editáveis)",
    currency_brl_per_usd:"BRL por USD",
    currency_eur_per_usd:"EUR por USD",
    currency_btc_usd:"Preço do BTC (USD)",
    currency_save:"Salvar",
    currency_close:"Fechar",
    currency_est:"*Conversão estimada. Ajuste as taxas se necessário.",
    currency_update:"Atualizar online (opcional)",
    currency_updated:"Taxas atualizadas.",
  });
  Object.assign(I18N.en, {
    currency:"Currency",
    currency_title:"Currency & conversion",
    currency_sub:"Choose a currency to view checkout prices.",
    currency_rates:"Rates (editable)",
    currency_brl_per_usd:"BRL per USD",
    currency_eur_per_usd:"EUR per USD",
    currency_btc_usd:"BTC price (USD)",
    currency_save:"Save",
    currency_close:"Close",
    currency_est:"*Estimated conversion. Adjust rates if needed.",
    currency_update:"Update online (optional)",
    currency_updated:"Rates updated.",
  });

  /* ---------- Catalog (demo / example) ---------- */
  const CATEGORIES = [
    { id:"oils", labelKey:"cat_oils" },
    { id:"strains", labelKey:"cat_strains" },
    { id:"cigars", labelKey:"cat_cigars" },
    { id:"extracts", labelKey:"cat_extracts" },
    { id:"edibles", labelKey:"cat_edibles" },
    { id:"beverages", labelKey:"cat_beverages" },
    { id:"vapes", labelKey:"cat_vapes" },
    { id:"pets", labelKey:"cat_pets" },
    { id:"accessories", labelKey:"cat_accessories" },
  ];

  // Strains (conforme catálogo)
  const STRAIN_LIST = [
    "Gorilla Glue",
    "Purple Haze",
    "OG Kush",
  ];

  const OIL_MG = ["20 mg/mL","50 mg/mL","200 mg/mL"];
  const SPECTRUM = ["Isolado","Full Spectrum"];
  const CBD_THC = ["CBD","THC (onde permitido)"];

  /* ---------- Products (demo / example) ----------
     Observação: apenas catálogo/categorias foram ajustados (layout/estilo mantidos).
  ---------- */
  const PRODUCTS = [
    // Óleos
    {
      id:"oil-cbd",
      category:"oils",
      name:"Óleo CBD",
      price:39.9,
      short:"CBD • 30ml • (demo)",
      imageLabel:"Óleo",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["20 mg/mL", "50 mg/mL", "200 mg/mL"] }, { key:"ml", labelKey:"opt_ml", options:["30ml"] }],
      desc:"Óleo de CBD (demo). Variações de potência em mg/mL. Sempre confirme a legalidade local e utilize com responsabilidade."
    },
    {
      id:"oil-cbg",
      category:"oils",
      name:"Óleo CBG",
      price:42.9,
      short:"CBG • 30ml • (demo)",
      imageLabel:"Óleo",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["20 mg/mL", "50 mg/mL", "200 mg/mL"] }, { key:"ml", labelKey:"opt_ml", options:["30ml"] }],
      desc:"Óleo de CBG (demo). Variações de potência em mg/mL. Sempre confirme a legalidade local e utilize com responsabilidade."
    },
    {
      id:"oil-thc",
      category:"oils",
      name:"Óleo THC",
      price:49.9,
      short:"THC • 30ml • (demo)",
      imageLabel:"Óleo",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["20 mg/mL", "50 mg/mL", "200 mg/mL"] }, { key:"ml", labelKey:"opt_ml", options:["30ml"] }],
      desc:"Óleo de THC (demo). Produto com THC pode ter efeitos psicoativos. Use com cautela e confirme conformidade/idade/legalidade."
    },
    {
      id:"oil-full-spectrum",
      category:"oils",
      name:"Óleo Full Spectrum",
      price:44.9,
      short:"Full Spectrum • 30ml • (contém THC) (demo)",
      imageLabel:"Óleo",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["20 mg/mL", "50 mg/mL", "200 mg/mL"] }, { key:"ml", labelKey:"opt_ml", options:["30ml"] }],
      desc:"Óleo Full Spectrum (demo). **Aviso:** pode conter THC (mesmo em baixas quantidades), o que pode afetar dose/efeitos e testes. Verifique rótulo, conformidade e legislação local."
    },
    // Strains
    {
      id:"strain-gorilla-glue",
      category:"strains",
      name:"Gorilla Glue",
      price:59.9,
      short:"Strain • Flor • (demo)",
      imageLabel:"Strain",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue"] }, { key:"weight", labelKey:"opt_weight", options:["5g", "10g"] }],
      desc:"Gorilla Glue (demo). Produto ilustrativo. Confirme disponibilidade e conformidade local."
    },
    {
      id:"strain-purple-haze",
      category:"strains",
      name:"Purple Haze",
      price:59.9,
      short:"Strain • Flor • (demo)",
      imageLabel:"Strain",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Purple Haze"] }, { key:"weight", labelKey:"opt_weight", options:["5g", "10g"] }],
      desc:"Purple Haze (demo). Produto ilustrativo. Confirme disponibilidade e conformidade local."
    },
    {
      id:"strain-og-kush",
      category:"strains",
      name:"OG Kush",
      price:59.9,
      short:"Strain • Flor • (demo)",
      imageLabel:"Strain",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["5g", "10g"] }],
      desc:"OG Kush (demo). Produto ilustrativo. Confirme disponibilidade e conformidade local."
    },
    // Charutaria
    {
      id:"cigar-san-juan",
      category:"cigars",
      name:"Charutos San Juan",
      price:79.9,
      short:"Charutos • (demo)",
      imageLabel:"Charuto",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["10g", "15g", "20g"] }],
      desc:"Charutos San Juan (demo). Escolha variedade (strain) e peso total da caixa."
    },
    {
      id:"juanitos",
      category:"cigars",
      name:"Juanitos (pre-roll)",
      price:14.9,
      short:"Pre-roll • 1g • (demo)",
      imageLabel:"Juanitos",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g"] }],
      desc:"Juanitos (demo). Cigarro pre-enrolado de 1g, com opção de strain."
    },
    // Extrações
    {
      id:"extract-dry",
      category:"extracts",
      name:"Dry",
      price:29.9,
      short:"Extração • (demo)",
      imageLabel:"Dry",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "5g"] }],
      desc:"Dry (demo). Escolha strain e peso. Confirme conformidade local."
    },
    {
      id:"extract-bubble-hash",
      category:"extracts",
      name:"Bubble Hash",
      price:34.9,
      short:"Extração • (demo)",
      imageLabel:"Bubble Hash",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "5g"] }],
      desc:"Bubble Hash (demo). Escolha strain e peso. Confirme conformidade local."
    },
    {
      id:"extract-rosin",
      category:"extracts",
      name:"Rosin",
      price:39.9,
      short:"Extração • (demo)",
      imageLabel:"Rosin",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "5g"] }],
      desc:"Rosin (demo). Escolha strain e peso. Confirme conformidade local."
    },
    {
      id:"extract-live-rosin",
      category:"extracts",
      name:"Live Rosin",
      price:44.9,
      short:"Extração • (demo)",
      imageLabel:"Live Rosin",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "5g"] }],
      desc:"Live Rosin (demo). Escolha strain e peso. Confirme conformidade local."
    },
    {
      id:"extract-diamonds",
      category:"extracts",
      name:"Diamonds THC/CBD",
      price:49.9,
      short:"Extração • (demo)",
      imageLabel:"Diamonds",
      optionGroups:[{ key:"strain", labelKey:"opt_strain", options:["Gorilla Glue", "Purple Haze", "OG Kush"] }, { key:"weight", labelKey:"opt_weight", options:["1g", "5g"] }],
      desc:"Diamonds THC/CBD (demo). Escolha strain e peso. Confirme conformidade local."
    },
    // Comestíveis
    {
      id:"edible-gummies",
      category:"edibles",
      name:"Gumes (Gummies)",
      price:24.9,
      short:"Comestível • Gumes • (demo)",
      imageLabel:"Gumes",
      optionGroups:[{ key:"flavor", labelKey:"opt_flavor", options:["Morango", "Melancia", "Uva", "Laranja", "Limão", "Tangerina", "Manga"] }, { key:"weight", labelKey:"opt_weight", options:["50g", "100g"] }],
      desc:"Gumes (demo). Escolha sabor e tamanho."
    },
    {
      id:"edible-honey",
      category:"edibles",
      name:"Mel infundido de THC",
      price:29.9,
      short:"Comestível • 100ml • (demo)",
      imageLabel:"Mel",
      optionGroups:[{ key:"ml", labelKey:"opt_ml", options:["100ml"] }],
      desc:"Mel infundido (demo). Produto com THC pode ter efeitos psicoativos. Use com responsabilidade."
    },
    {
      id:"edible-butter",
      category:"edibles",
      name:"Manteiga Trufada de THC",
      price:32.9,
      short:"Comestível • 100g • (demo)",
      imageLabel:"Manteiga",
      optionGroups:[{ key:"weight", labelKey:"opt_weight", options:["100g"] }],
      desc:"Manteiga trufada (demo). Produto com THC pode ter efeitos psicoativos."
    },
    {
      id:"edible-chocolate",
      category:"edibles",
      name:"Chocolate",
      price:19.9,
      short:"Comestível • (demo)",
      imageLabel:"Chocolate",
      optionGroups:[{ key:"flavor", labelKey:"opt_flavor", options:["Ao leite", "Amargo", "Branco"] }, { key:"weight", labelKey:"opt_weight", options:["50g", "100g"] }],
      desc:"Chocolate (demo)."
    },
    {
      id:"edible-gum",
      category:"edibles",
      name:"Chicletes CBD e THC",
      price:14.9,
      short:"Comestível • Chiclete • (demo)",
      imageLabel:"Chicletes",
      optionGroups:[{ key:"type", labelKey:"opt_type", options:["CBD", "THC"] }, { key:"flavor", labelKey:"opt_flavor", options:["Menta", "Hortelã", "Canela"] }],
      desc:"Chicletes (demo). Opções CBD ou THC."
    },
    {
      id:"edible-lollipops",
      category:"edibles",
      name:"Pirulitos THC (sabores)",
      price:16.9,
      short:"Comestível • Pirulito • (demo)",
      imageLabel:"Pirulitos",
      optionGroups:[{ key:"flavor", labelKey:"opt_flavor", options:["Morango", "Melancia", "Uva", "Manga", "Limão"] }],
      desc:"Pirulitos (demo). Produto com THC pode ter efeitos psicoativos."
    },
    // Bebidas
    {
      id:"bev-soda",
      category:"beverages",
      name:"Refrigerante infundido THC/CBD",
      price:12.9,
      short:"Bebida • (demo)",
      imageLabel:"Refrigerante",
      optionGroups:[{ key:"type", labelKey:"opt_type", options:["THC", "CBD"] }, { key:"flavor", labelKey:"opt_flavor", options:["Cola", "Limão", "Gengibre"] }],
      desc:"Refrigerante (demo)."
    },
    {
      id:"bev-tea",
      category:"beverages",
      name:"Chá infundido THC",
      price:10.9,
      short:"Bebida • (demo)",
      imageLabel:"Chá",
      optionGroups:[{ key:"flavor", labelKey:"opt_flavor", options:["Camomila", "Hibisco", "Chá verde"] }],
      desc:"Chá (demo). Produto com THC pode ter efeitos psicoativos."
    },
    {
      id:"bev-lemonade",
      category:"beverages",
      name:"Limonada infundida THC",
      price:11.9,
      short:"Bebida • (demo)",
      imageLabel:"Limonada",
      optionGroups:[{ key:"flavor", labelKey:"opt_flavor", options:["Clássica", "Gengibre", "Hortelã"] }],
      desc:"Limonada (demo). Produto com THC pode ter efeitos psicoativos."
    },
    // Vapes
    {
      id:"vape-thc",
      category:"vapes",
      name:"Vape THC (sabores)",
      price:59.9,
      short:"Vape • (demo)",
      imageLabel:"Vape",
      optionGroups:[{ key:"puffs", labelKey:"opt_puffs", options:["1000 puffs", "10000 puffs"] }, { key:"flavor", labelKey:"opt_flavor", options:["Menta", "Manga", "Blueberry", "Uva", "Limão", "Melancia"] }],
      desc:"Vape (demo). Produto com THC pode ter efeitos psicoativos. Confirme conformidade local."
    },
    // Pets
    {
      id:"pet-pet-oil",
      category:"pets",
      name:"Óleo CBD Pet",
      price:29.9,
      short:"Pet • (demo)",
      imageLabel:"Óleo",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["Baixa", "Média", "Alta"] }, { key:"weight", labelKey:"opt_weight", options:["30ml", "60ml"] }],
      desc:"Linha Pet (demo). Exemplos comuns de produtos à base de CBD para pets em mercados regulados. Sempre verifique regulamentação local e orientação veterinária."
    },
    {
      id:"pet-pet-calming",
      category:"pets",
      name:"Pet Calming Chews (CBD)",
      price:24.9,
      short:"Pet • (demo)",
      imageLabel:"Pet",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["Baixa", "Média", "Alta"] }, { key:"weight", labelKey:"opt_weight", options:["60 chews", "120 chews"] }],
      desc:"Linha Pet (demo). Exemplos comuns de produtos à base de CBD para pets em mercados regulados. Sempre verifique regulamentação local e orientação veterinária."
    },
    {
      id:"pet-pet-joints",
      category:"pets",
      name:"Pet Joint Support (CBD)",
      price:26.9,
      short:"Pet • (demo)",
      imageLabel:"Pet",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["Baixa", "Média", "Alta"] }, { key:"weight", labelKey:"opt_weight", options:["50g", "100g"] }],
      desc:"Linha Pet (demo). Exemplos comuns de produtos à base de CBD para pets em mercados regulados. Sempre verifique regulamentação local e orientação veterinária."
    },
    {
      id:"pet-pet-balm",
      category:"pets",
      name:"Bálsamo tópico CBD (Pet)",
      price:19.9,
      short:"Pet • (demo)",
      imageLabel:"Pet",
      optionGroups:[{ key:"strength", labelKey:"opt_strength", options:["Baixa", "Média", "Alta"] }, { key:"weight", labelKey:"opt_weight", options:["50g", "100g"] }],
      desc:"Linha Pet (demo). Exemplos comuns de produtos à base de CBD para pets em mercados regulados. Sempre verifique regulamentação local e orientação veterinária."
    },
    // Acessórios
    {
      id:"acc-hemp-pen",
      category:"accessories",
      name:"Canetas Hemp",
      price:9.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"format", labelKey:"opt_format", options:["Preta", "Verde", "Branca"] }],
      desc:"Canetas Hemp (demo)."
    },
    {
      id:"acc-tshirt",
      category:"accessories",
      name:"Camisetas",
      price:39.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"size", labelKey:"opt_size", options:["P", "M", "G", "GG"] }],
      desc:"Camisetas (demo)."
    },
    {
      id:"acc-cap",
      category:"accessories",
      name:"Bonés (trucker)",
      price:29.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"size", labelKey:"opt_size", options:["Único"] }],
      desc:"Bonés (trucker) (demo)."
    },
    {
      id:"acc-grinder",
      category:"accessories",
      name:"Dichavadores",
      price:19.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"size", labelKey:"opt_size", options:["P", "M", "G"] }],
      desc:"Dichavadores (demo)."
    },
    {
      id:"acc-tips",
      category:"accessories",
      name:"Piteiras",
      price:7.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"format", labelKey:"opt_format", options:["Slim", "Regular"] }],
      desc:"Piteiras (demo)."
    },
    {
      id:"acc-papers",
      category:"accessories",
      name:"Sedas",
      price:6.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"format", labelKey:"opt_format", options:["King Size", "1 1/4", "Slim"] }],
      desc:"Sedas (demo)."
    },
    {
      id:"acc-roller",
      category:"accessories",
      name:"Bolador",
      price:12.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"format", labelKey:"opt_format", options:["1 1/4", "King Size"] }],
      desc:"Bolador (demo)."
    },
    {
      id:"acc-bong",
      category:"accessories",
      name:"Bongs",
      price:89.9,
      short:"Acessório • (demo)",
      imageLabel:"Acessório",
      optionGroups:[{ key:"size", labelKey:"opt_size", options:["Pequeno", "Médio", "Grande"] }],
      desc:"Bongs (demo)."
    }
  ];

  /* ---------- Home hero carousel slides ----------
     Put your real images in: ./assets/hero-*.jpg (or png)
     If an image is missing, the centered label remains visible.
  */
  const HERO_SLIDES = [
    { src:"assets/hero-oil.jpg", alt:"Óleo" },
    { src:"assets/hero-gummies.jpg", alt:"Gomas" },
    { src:"assets/hero-extracts.jpg", alt:"Extrações" },
    { src:"assets/hero-accessories.jpg", alt:"Acessórios" },
  ];
  
  /* ---------- Product helpers ---------- */
  function findProduct(id){ return PRODUCTS.find(p=>p.id===id); }
  
  /* ---------- Cart operations ---------- */
  function addToCart(productId, variant={}, qty=1){
    const cart = getCart();
    const variantKey = Object.entries(variant).map(([k,v])=>`${k}:${v}`).join("|");
    const key = `${productId}::${variantKey}`;
    const found = cart.find(i=>i.key===key);
    const q = Math.max(1, Math.min(99, Number(qty)||1));
    if(found) found.qty += q;
    else cart.push({ key, productId, variant, qty:q });
    setCart(cart);
  }
  function removeFromCart(key){ setCart(getCart().filter(i=>i.key!==key)); }
  function changeQty(key, delta){
    const cart = getCart();
    const it = cart.find(i=>i.key===key);
    if(!it) return;
    it.qty += delta;
    if(it.qty <= 0) return removeFromCart(key);
    setCart(cart);
  }
  function cartTotals(cart){
    const subtotal = cart.reduce((sum, it)=>{
      const p = findProduct(it.productId);
      return sum + (p ? p.price * it.qty : 0);
    }, 0);
    const shipping = subtotal > 0 ? 7.90 : 0;
    const tax = subtotal > 0 ? subtotal * 0.06 : 0;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  }
  
  /* ---------- UI helpers ---------- */
  function currentLangObj(){ return LANGS.find(l=>l.code===getLang()) || LANGS[0]; }
  function updateCartBadge(){
    const badge = document.getElementById("cartBadge");
    if(badge) badge.textContent = String(cartCount());
  }
  function syncLangButton(){
    const btn = document.getElementById("langBtn");
    if(!btn) return;
    const cur = currentLangObj();
    const f = btn.querySelector(".langbtn__flag");
    const c = btn.querySelector(".langbtn__code");
    if(f) f.textContent = cur.flag;
    if(c) c.textContent = cur.code.toUpperCase();
  }
  function applyI18nStatic(){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph")));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el=>{
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
  }

  function initFooterSearch(){
    const input = document.getElementById("footerSearchInput");
    if(!input) return;

    const isProducts = /produtos\.html$/i.test(location.pathname) || location.href.includes("produtos.html");
    const mainSearch = document.getElementById("searchInput");

    // If we're on produtos.html, keep footer input synced with the current query.
    try{
      const u = new URL(location.href);
      const q = u.searchParams.get("q") || "";
      if(isProducts && q && !input.value) input.value = q;
    }catch{}

    const applyProductsFilter = ()=>{
      if(!isProducts || !mainSearch) return;
      mainSearch.value = input.value;
      mainSearch.dispatchEvent(new Event("input"));
    };

    input.addEventListener("input", ()=>{
      if(isProducts) applyProductsFilter();
    });

    input.addEventListener("keydown", (e)=>{
      if(e.key !== "Enter") return;
      e.preventDefault();
      const q = (input.value || "").trim();
      if(isProducts){
        applyProductsFilter();
        input.blur();
        return;
      }
      location.href = q ? `produtos.html?q=${encodeURIComponent(q)}` : "produtos.html";
    });
  }
  
  /* ---------- Language modal ---------- */
  function mountLangModal(){
    const modal = document.getElementById("langModal");
    if(!modal) return;
  
    const wheel = modal.querySelector("#langWheel");
    const btn = document.getElementById("langBtn");
    const closeBtn = modal.querySelector("#langClose");
  
    function renderWheel(){
      const cur = getLang();
      wheel.innerHTML = `
        <div class="wheel__focus"></div>
        ${LANGS.map(l=>{
          const active = l.code===cur ? "wheel__item--active" : "";
          return `
            <div class="wheel__item ${active}" data-code="${l.code}">
              <div class="wheel__left">
                <div class="wheel__flag">${l.flag}</div>
                <div>
                  <div class="wheel__name">${l.name}</div>
                  <div class="wheel__meta">${l.meta}</div>
                </div>
              </div>
              <div class="wheel__code">${l.code.toUpperCase()}</div>
            </div>
          `;
        }).join("")}
      `;
      wheel.querySelectorAll(".wheel__item").forEach(item=>{
        item.addEventListener("click", ()=>{
          setLang(item.dataset.code);
          syncLangButton();
          applyI18nStatic();
pageRenderAll();
    mountSmartFooter();
    mountNewsletter();
    mountCurrencyModal();
          renderWheel();
        });
      });
    }
  
    function open(){
      modal.classList.add("modal--open");
      renderWheel();
      const active = wheel.querySelector(".wheel__item--active");
      if(active) active.scrollIntoView({block:"center"});
    }
    function close(){ modal.classList.remove("modal--open"); }
  
    btn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e)=>{ if(e.target === modal) close(); });
  }
  


  /* ---------- Currency UI ---------- */
  function syncCurrencyButton(){
    const btn = document.getElementById("curBtn");
    if(!btn) return;
    const code = getCurrency();
    const c = btn.querySelector(".langbtn__code");
    if(c) c.textContent = code;
  }

  function ensureCurrencyButton(){
    const langBtn = document.getElementById("langBtn");
    if(!langBtn) return;
    if(document.getElementById("curBtn")) return;

    const btn = document.createElement("button");
    btn.className = "langbtn curbtn";
    btn.id = "curBtn";
    btn.type = "button";
    btn.innerHTML = `
      <span class="langbtn__flag">FX</span>
      <span class="langbtn__code">USD</span>
      <span class="langbtn__chev">▾</span>
    `;
    langBtn.insertAdjacentElement("afterend", btn);
  }

  function mountCurrencyModal(){
    ensureCurrencyButton();
    syncCurrencyButton();

    if(!document.getElementById("curModal")){
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.id = "curModal";
      modal.innerHTML = `
        <div class="sheet">
          <div class="sheet__head">
            <div class="sheet__title">${t("currency_title")}</div>
            <button class="sheet__close" id="curClose" type="button">${t("currency_close")}</button>
          </div>
          <div class="sheet__body">
            <div class="small" style="margin:0 0 10px">${t("currency_sub")}</div>
            <div class="wheel" id="curWheel"></div>
            <div class="hr" style="margin:14px 0"></div>
            <div class="small" style="margin-bottom:8px"><strong>${t("currency_rates")}</strong> <span class="muted">${t("currency_est")}</span></div>
            <div class="formgrid">
              <div class="field">
                <div class="label">${t("currency_brl_per_usd")}</div>
                <input class="input" id="rateBRL" inputmode="decimal" />
              </div>
              <div class="field">
                <div class="label">${t("currency_eur_per_usd")}</div>
                <input class="input" id="rateEUR" inputmode="decimal" />
              </div>
              <div class="field" style="grid-column:1/-1">
                <div class="label">${t("currency_btc_usd")}</div>
                <input class="input" id="rateBTC" inputmode="decimal" />
              </div>
            </div>
            <div class="paybox__actions" style="margin-top:12px">
              <button class="btn btn--primary" id="curSave" type="button">${t("currency_save")}</button>
              <button class="btn btn--ghost" id="curUpdate" type="button">${t("currency_update")}</button>
            </div>
            <div class="small" id="curStatus" aria-live="polite" style="margin-top:8px"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modal = document.getElementById("curModal");
    const wheel = document.getElementById("curWheel");
    const btn = document.getElementById("curBtn");
    const closeBtn = document.getElementById("curClose");
    const saveBtn = document.getElementById("curSave");
    const updBtn = document.getElementById("curUpdate");
    const status = document.getElementById("curStatus");
    const rateBRL = document.getElementById("rateBRL");
    const rateEUR = document.getElementById("rateEUR");
    const rateBTC = document.getElementById("rateBTC");

    function renderWheel(){
      const cur = getCurrency();
      wheel.innerHTML = `
        <div class="wheel__focus"></div>
        ${CUR.list.map(c=>{
          const active = c.code===cur ? "wheel__item--active" : "";
          const flag = (c.code === "BTC") ? "₿" :
                       (c.code === "SATS") ? "sat" :
                       (c.code === "EUR") ? "€" :
                       (c.code === "BRL") ? "R$" : "$";
          return `
            <div class="wheel__item ${active}" data-code="${c.code}">
              <div class="wheel__left">
                <div class="wheel__flag">${flag}</div>
                <div>
                  <div class="wheel__name">${c.label}</div>
                  <div class="wheel__meta">${c.code === "SATS" ? "Satoshis" : ""}</div>
                </div>
              </div>
              <div class="wheel__code">${c.code}</div>
            </div>
          `;
        }).join("")}
      `;
      wheel.querySelectorAll(".wheel__item").forEach(item=>{
        item.addEventListener("click", ()=>{
          setCurrency(item.dataset.code);
          syncCurrencyButton();
          pageRenderAll();
    mountProductBackNav();
          mountSmartFooter();
          mountNewsletter();
          renderWheel();
        });
      });
    }

    function loadRatesToInputs(){
      const r = getRates();
      if(rateBRL) rateBRL.value = String(r.BRL_PER_USD ?? "");
      if(rateEUR) rateEUR.value = String(r.EUR_PER_USD ?? "");
      if(rateBTC) rateBTC.value = String(r.BTC_USD ?? "");
    }

    function open(){
      loadRatesToInputs();
      if(status) status.textContent = "";
      renderWheel();
      modal.classList.add("modal--open");
    }
    function close(){ modal.classList.remove("modal--open"); }

    btn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    modal.addEventListener("click", (e)=>{ if(e.target === modal) close(); });

    saveBtn?.addEventListener("click", ()=>{
      setRates({
        BRL_PER_USD: parseFloat(String(rateBRL?.value||"")) || undefined,
        EUR_PER_USD: parseFloat(String(rateEUR?.value||"")) || undefined,
        BTC_USD: parseFloat(String(rateBTC?.value||"")) || undefined,
      });
      if(status) status.textContent = t("currency_updated");
      pageRenderAll();
    });

    // Optional online update (works when the site is served with internet access).
    updBtn?.addEventListener("click", async ()=>{
      try{
        if(status) status.textContent = "…";
        const [fxRes, btcRes] = await Promise.all([
          fetch("https://api.exchangerate.host/latest?base=USD&symbols=BRL,EUR"),
          fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
        ]);
        const fx = await fxRes.json();
        const btc = await btcRes.json();
        const brl = Number(fx?.rates?.BRL);
        const eur = Number(fx?.rates?.EUR);
        const btcUsd = Number(btc?.bitcoin?.usd);
        setRates({
          BRL_PER_USD: isFinite(brl) ? brl : undefined,
          EUR_PER_USD: isFinite(eur) ? eur : undefined,
          BTC_USD: isFinite(btcUsd) ? btcUsd : undefined,
        });
        loadRatesToInputs();
        if(status) status.textContent = t("currency_updated");
        pageRenderAll();
      } catch(err){
        if(status) status.textContent = "(offline)";
      }
    });
  }

  /* ---------- Auth UI ---------- */
  function mountAuthUI(){
    const authArea = document.getElementById("authArea");
    if(!authArea) return;
    const user = getUser();
    if(user){
      authArea.innerHTML = `
        <a class="topIcon" href="minhas-compras.html" aria-label="${t("my_orders")}">
          <span class="sr-only">${t("my_orders")}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 6h10M7 10h10M7 14h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            <path d="M6 3.8h12c1 0 1.8.8 1.8 1.8v12.4c0 1-.8 1.8-1.8 1.8H6c-1 0-1.8-.8-1.8-1.8V5.6C4.2 4.6 5 3.8 6 3.8Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        <button class="topIcon" id="logoutBtn" type="button" aria-label="${t("sign_out")}">
          <span class="sr-only">${t("sign_out")}</span>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10 7V5.8C10 4.8 10.8 4 11.8 4h6.4C19.2 4 20 4.8 20 5.8v12.4c0 1-.8 1.8-1.8 1.8h-6.4c-1 0-1.8-.8-1.8-1.8V17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M4 12h9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m7 9-3 3 3 3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>`;
      authArea.querySelector("#logoutBtn").addEventListener("click", logout);
    } else {
      authArea.innerHTML = `<a class="topIcon" href="login.html" aria-label="${t("login")}">
        <span class="sr-only">${t("login")}</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.2c-4.2 0-7.6 2-7.6 4.4V20h15.2v-1.4c0-2.4-3.4-4.4-7.6-4.4Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>`;
    }
  }
  
  /* ---------- Rendering: cards ---------- */
  function cardHTML(p){
    return `
      <a class="card" href="produto.html?id=${encodeURIComponent(p.id)}">
        <div class="card__image">${t(p.imageLabel)}</div>
        <h3 class="card__title ${p.id.startsWith("preroll") ? "card__title--elegant" : ""}">${t(p.name)}</h3>
        <p class="card__meta">${t(p.short)}</p>
        <div class="card__row">
          <div class="card__price">${money(p.price)}</div>
        </div>
      </a>
    `;
  }

  /* ---------- Deterministic random helpers (for rotating featured products) ---------- */
  function hashToSeed(str){
    // FNV-1a 32-bit
    let h = 2166136261;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function mulberry32(seed){
    let a = seed >>> 0;
    return function(){
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pickN(items, n, rand){
    const arr = items.slice();
    // Fisher-Yates shuffle (partial)
    for(let i=arr.length-1;i>0;i--){
      const j = Math.floor(rand() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(n, arr.length));
  }
  
  /* ---------- HOME featured ---------- */
  function renderHome(){
    const featuredGrid = document.getElementById("featuredGrid"); // legacy fallback
    if(!featuredGrid) return;

    // Rotate featured products every time the user returns to the Home page.
    // Uses a deterministic seed based on time bucket + session visit count.
    const now = new Date();
    const dayKey = now.toISOString().slice(0,10); // YYYY-MM-DD
    const bucket = Math.floor((now.getHours() * 60 + now.getMinutes()) / 30); // 30-min buckets
    const visitKey = "hs_home_visit";
    const lastKey = "hs_home_last_featured";
    const visits = (Number(sessionStorage.getItem(visitKey) || "0") + 1);
    sessionStorage.setItem(visitKey, String(visits));

    const seedBase = `${dayKey}:${bucket}:${visits}`;
    const seed = hashToSeed(seedBase);
    const rand = mulberry32(seed);

    // Candidate pool (avoid ultra-long lists by keeping everything eligible)
    const pool = PRODUCTS.filter(Boolean);
    let featured = pickN(pool, 3, rand);

    // Ensure it changes compared to the last home render in this session
    const last = sessionStorage.getItem(lastKey) || "";
    const ids = featured.map(p=>p.id).join("|");
    if(ids && ids === last && pool.length > 3){
      // Shift deterministically by reseeding once
      const rand2 = mulberry32(hashToSeed(seedBase + ":alt"));
      featured = pickN(pool, 3, rand2);
    }
    sessionStorage.setItem(lastKey, featured.map(p=>p.id).join("|"));

    featuredGrid.innerHTML = featured.map(cardHTML).join("");

    // hero carousel (only on home)
    initHeroCarousel();
  }

  /* ---------- Home hero carousel ---------- */
  function initHeroCarousel(){
    const root = document.getElementById("heroCarousel");
    if(!root) return;
    if(root.dataset.bound === "1"){
      // keep overlay in sync with language
      const ov = document.getElementById("heroOverlay");
      if(ov){
        ov.innerHTML = `<span>${t("hero_image_label")}</span>`;
      }
      return;
    }
    root.dataset.bound = "1";

    const slidesWrap = document.getElementById("heroSlides");
    const dotsWrap = document.getElementById("heroDots");
    const overlay = document.getElementById("heroOverlay");
    const prev = document.getElementById("heroPrev");
    const next = document.getElementById("heroNext");

    if(overlay){ overlay.innerHTML = `<span>${t("hero_image_label")}</span>`; }

    let index = 0;
    let timer = null;
    const slides = (HERO_SLIDES || []).slice();

    function build(){
      if(slidesWrap) slidesWrap.innerHTML = "";
      if(dotsWrap) dotsWrap.innerHTML = "";

      slides.forEach((s, i)=>{
        const slide = document.createElement("div");
        slide.className = "heroCarousel__slide" + (i===0?" is-active":"");

        const img = document.createElement("img");
        img.alt = s.alt || "";
        img.loading = "lazy";
        img.decoding = "async";
        img.src = s.src;
        img.addEventListener("error", ()=>{
          // hide broken image and keep the centered label visible
          img.style.display = "none";
        });
        slide.appendChild(img);
        slidesWrap?.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "heroCarousel__dot" + (i===0?" is-active":"");
        dot.setAttribute("aria-label", `Slide ${i+1}`);
        dot.addEventListener("click", ()=>go(i, true));
        dotsWrap?.appendChild(dot);
      });

      // If no images exist at all (404), the box still looks nice (hero background)
      // and overlay label remains centered.
    }

    function setActive(){
      const nodes = slidesWrap?.querySelectorAll(".heroCarousel__slide") || [];
      const dots = dotsWrap?.querySelectorAll(".heroCarousel__dot") || [];
      nodes.forEach((n, i)=> n.classList.toggle("is-active", i===index));
      dots.forEach((d, i)=> d.classList.toggle("is-active", i===index));

      // Show the centered label ONLY when the active slide has no working image.
      if(overlay){
        const active = nodes[index];
        const img = active?.querySelector("img");
        const hasImg = img && img.style.display !== "none" && img.complete && img.naturalWidth > 0;
        overlay.classList.toggle("is-hidden", !!hasImg);
      }
    }

    function go(i, fromUser=false){
      if(!slides.length) return;
      index = (i + slides.length) % slides.length;
      setActive();
      if(fromUser) restart();
    }

    function restart(){
      if(timer) clearInterval(timer);
      timer = setInterval(()=>go(index+1), 4200);
    }

    prev?.addEventListener("click", ()=>go(index-1, true));
    next?.addEventListener("click", ()=>go(index+1, true));

    build();
    restart();

    // Pause on hover for desktop
    root.addEventListener("mouseenter", ()=>{ if(timer) clearInterval(timer); });
    root.addEventListener("mouseleave", ()=>restart());
  }
  
  /* ---------- PRODUCTS list ---------- */
  function renderProductsList(){
    const grid = document.getElementById("productsGrid");
    if(!grid) return;
  
    const searchInput = document.getElementById("searchInput");
    const categorySelect = document.getElementById("categorySelect");

    const footerSearchWrap = document.getElementById("footerSearchWrap");
    if(footerSearchWrap) footerSearchWrap.style.display = "block";

    // restore filters from URL (keeps state when returning)
    const u = new URL(location.href);
    const q0 = u.searchParams.get("q") || "";
    const c0 = u.searchParams.get("cat") || "all";
    if(searchInput) searchInput.value = q0;

  
    categorySelect.innerHTML = `
      <option value="all">${t("all_categories")}</option>
      ${CATEGORIES.map(c=>`<option value="${c.id}">${t(c.labelKey)}</option>`).join("")}
    `;
    if(categorySelect) categorySelect.value = c0;

    // Category navigation bar (pills)
    const categoryBar = document.getElementById("categoryBar");
    if(categoryBar){
      const hasProduct = (catId)=> PRODUCTS.some(p=>p.category===catId);
      const barCats = ["all", ...CATEGORIES.filter(c=>hasProduct(c.id)).map(c=>c.id)];
      const labelFor = (id)=>{
        if(id==="all") return t("all_categories");
        const c = CATEGORIES.find(x=>x.id===id);
        return c ? t(c.labelKey) : id;
      };
      categoryBar.innerHTML = barCats.map((id,i)=>`
        <button class="catpill ${i===0?"catpill--active":""}" type="button" data-cat="${id}">
          ${labelFor(id)}
        </button>
      `).join("");

      const setActive = (val)=>{
        categoryBar.querySelectorAll(".catpill").forEach(b=>{
          b.classList.toggle("catpill--active", b.getAttribute("data-cat")===val);
        });
      };

      categoryBar.addEventListener("click", (e)=>{
        const btn = e.target.closest(".catpill");
        if(!btn) return;
        const val = btn.getAttribute("data-cat");
        if(!val) return;
        categorySelect.value = val;
        setActive(val);
        apply();
      });

      categorySelect?.addEventListener("change", ()=>{
        setActive(categorySelect.value || "all");
      });
    }

    function apply(){
      const q = (searchInput?.value||"").trim().toLowerCase();
      const cat = categorySelect?.value || "all";
  
      const filtered = PRODUCTS.filter(p=>{
        const matchQ = !q || t(p.name).toLowerCase().includes(q) || t(p.short).toLowerCase().includes(q);
        const matchCat = (cat==="all") ? true : p.category===cat;
        return matchQ && matchCat;
      });
  
      grid.innerHTML = filtered.map(cardHTML).join("");

      // keep state in URL
      const uu = new URL(location.href);
      if(q) uu.searchParams.set("q", q); else uu.searchParams.delete("q");
      if(cat && cat!=="all") uu.searchParams.set("cat", cat); else uu.searchParams.delete("cat");
      history.replaceState({}, "", uu.toString());

      // remember where user was (so product page "voltar" returns here)
      grid.querySelectorAll("a.card").forEach(a=>{
        a.addEventListener("click", ()=>{
          sessionStorage.setItem("lastProductsUrl", location.href);
        }, { once:true });
      });
    }

  
    searchInput?.addEventListener("input", apply);
    categorySelect?.addEventListener("change", apply);
    apply();
  }
  
  /* ---------- PRODUCT page ---------- */
  function getParam(name){
    const url = new URL(location.href);
    return url.searchParams.get(name);
  }
  
  function renderProductPage(){
    const root = document.getElementById("productPage");
    if(!root) return;
  
    const id = getParam("id") || PRODUCTS[0].id;
    const p = findProduct(id) || PRODUCTS[0];
  
    // default variant = first option in each group
    const selected = {};
    let qty = 1;
    (p.optionGroups || []).forEach(g=>{
      selected[g.key] = g.options[0];
    });
  
    function optionsUI(group){
      const many = (group.options || []).length > 12;
      if(many){
        return `
          <div class="optGroup">
            <div class="optGroup__label">${t(group.labelKey)}</div>
            <select class="select" data-group="${group.key}">
              ${(group.options||[]).map((opt, idx)=>`<option value="${opt}" ${idx===0?"selected":""}>${t(opt)}</option>`).join("")}
            </select>
          </div>
        `;
      }
      return `
        <div class="optGroup">
          <div class="optGroup__label">${t(group.labelKey)}</div>
          <div class="pillset" data-group="${group.key}">
            ${(group.options||[]).map((opt, idx)=>`
              <button type="button" class="pill ${idx===0 ? "pill--active":""}" data-value="${opt}">${t(opt)}</button>
            `).join("")}
          </div>
        </div>
      `;
    }

    root.innerHTML = `
      <div class="productView">
        <div class="productView__media" aria-hidden="true">
          <div class="productView__mediaInner">${t(p.imageLabel)}</div>
        </div>

        <div class="productView__panel">
          <h2 class="productView__name">${t(p.name)}</h2>
          <p class="productView__hint">${t("choose_volume_strain")}</p>

          <div class="productView__opts">
            ${(p.optionGroups||[]).map(optionsUI).join("")}
          </div>

          <div class="productView__actions">
            <div class="qty" style="margin-right:10px">
              <button type="button" id="qtyMinus" aria-label="-">−</button>
              <strong id="qtyVal">1</strong>
              <button type="button" id="qtyPlus" aria-label="+">+</button>
            </div>
            <button class="btn btn--primary" id="addToCartBtn">${t("add_cart")}</button>
            <a class="btn btn--ghost" href="carrinho.html">${t("view_cart")}</a>
          </div>
        </div>
      </div>
    `;
  
    // option handlers
    root.querySelectorAll("select.select").forEach(sel=>{
      const gkey = sel.getAttribute("data-group");
      sel.addEventListener("change", ()=>{
        selected[gkey] = sel.value;
      });
    });

    root.querySelectorAll(".pillset").forEach(set=>{
      const gkey = set.dataset.group;
      const pills = Array.from(set.querySelectorAll(".pill"));
      pills.forEach(btn=>{
        btn.addEventListener("click", ()=>{
          pills.forEach(x=>x.classList.remove("pill--active"));
          btn.classList.add("pill--active");
          selected[gkey] = btn.dataset.value;
        });
      });
    });
  
    const qtyVal = root.querySelector("#qtyVal");
    root.querySelector("#qtyMinus")?.addEventListener("click", ()=>{
      qty = Math.max(1, qty-1);
      if(qtyVal) qtyVal.textContent = String(qty);
    });
    root.querySelector("#qtyPlus")?.addEventListener("click", ()=>{
      qty = Math.min(99, qty+1);
      if(qtyVal) qtyVal.textContent = String(qty);
    });

    root.querySelector("#addToCartBtn").addEventListener("click", ()=>{
      addToCart(p.id, selected, qty);
      updateCartBadge();
      // no popup on add-to-cart (requested)
    });
  }
  
  /* ---------- LOGIN page ---------- */
  function renderLogin(){
    const root = document.getElementById("loginPage");
    if(!root) return;
  
    const user = getUser();
    if(user){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("login")}</h2>
          <p class="small">${user.email}</p>
          <div class="hr"></div>
          <button class="btn btn--primary" id="logout2">${t("sign_out")}</button>
        </div>
      `;
      root.querySelector("#logout2").addEventListener("click", logout);
      return;
    }
  
    root.innerHTML = `
      <div class="cardform">
        <h2 style="margin:0 0 8px">${t("login")}</h2>
        <p class="small">${t("create_demo")}</p>
        <div class="hr"></div>
  
        <form id="loginForm" class="formgrid formgrid--1">
          <div class="field">
            <div class="label">${t("email")}</div>
            <input class="input" name="email" required />
          </div>
          <div class="field">
            <div class="label">${t("password")}</div>
            <input class="input" type="password" name="password" required />
          </div>
          <button class="btn btn--primary" type="submit">${t("sign_in")}</button>
        </form>
      </div>
    `;
  
    root.querySelector("#loginForm").addEventListener("submit", async (e)=>{
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email")||"").trim();
      const password = String(fd.get("password")||"").trim();
      if(!email || !password) return;
      if(password.length < 8){
        alert("A senha precisa ter no mínimo 8 caracteres.");
        return;
      }
      try{
        const payload = await apiFetch("/auth/login", { method:"POST", body: JSON.stringify({ email, password }) });
        setAuthSession(payload);
        const ret = localStorage.getItem("hemp_return_after_login");
        if(ret){ localStorage.removeItem("hemp_return_after_login"); location.href = ret; }
        else location.href = "index.html";
      }catch(err){
        // If user doesn't exist, auto-register then login
        // @ts-ignore
        if(err && err.status === 401){
          try{
            const payload = await apiFetch("/auth/register", { method:"POST", body: JSON.stringify({ email, password }) });
            setAuthSession(payload);
            const ret = localStorage.getItem("hemp_return_after_login");
            if(ret){ localStorage.removeItem("hemp_return_after_login"); location.href = ret; }
            else location.href = "index.html";
            return;
          }catch(e2){
            // fallthrough
          }
        }
        alert((err && err.message) ? err.message : "Falha ao entrar.");
      }
    });
  }
  
  /* ---------- CART page ---------- */
  function renderCart(){
    const root = document.getElementById("cartPage");
    if(!root) return;
  
    const cart = getCart();
    if(cart.length === 0){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("cart")}</h2>
          <p class="small">${t("empty_cart")}</p>
          <div class="hr"></div>
          <a class="btn btn--primary" href="produtos.html">${t("products")}</a>
        </div>
      `;
      return;
    }
  
    const totals = cartTotals(cart);
  
    root.innerHTML = `
      <div class="cardform">
        <h2 style="margin:0 0 8px">${t("cart")}</h2>
        <div class="hr"></div>
  
        <div class="cartrow" style="font-weight:900;color:#0f172a;border-bottom:1px solid var(--line);">
          <div>${t("item")}</div>
          <div>${t("price")}</div>
          <div>${t("qty")}</div>
          <div></div>
        </div>
  
        ${cart.map(it=>{
          const p = findProduct(it.productId);
          const name = p ? t(p.name) : it.productId;
          const price = p ? p.price : 0;
          const v = it.variant || {};
          const variantText = Object.values(v).filter(Boolean).map(x=>t(x)).join(" • ");
          return `
            <div class="cartrow">
              <div>
                <div class="cartrow__title">${name}</div>
                <div class="small">${variantText}</div>
              </div>
              <div>${money(price)}</div>
              <div class="qty">
                <button data-dec="${it.key}">-</button>
                <strong>${it.qty}</strong>
                <button data-inc="${it.key}">+</button>
              </div>
              <div>
                <button class="btn btn--ghost" data-rem="${it.key}" style="padding:10px 14px">${t("remove")}</button>
              </div>
            </div>
          `;
        }).join("")}
  
        <div class="totals">
          <div class="totals__row"><span>${t("subtotal")}</span><strong>${money(totals.subtotal)}</strong></div>
          <div class="totals__row"><span>${t("shipping")}</span><strong>${money(totals.shipping)}</strong></div>
          <div class="totals__row"><span>${t("tax")}</span><strong>${money(totals.tax)}</strong></div>
          <div class="hr"></div>
          <div class="totals__row" style="font-size:18px"><span>${t("total")}</span><strong>${money(totals.total)}</strong></div>
        </div>
  
        <div class="actions">
          <a class="btn btn--primary" href="checkout.html">${t("go_checkout")}</a>
          <a class="btn btn--ghost" href="produtos.html">${t("continue")}</a>
        </div>
      </div>
    `;
  
    root.querySelectorAll("[data-inc]").forEach(b=>{
      b.addEventListener("click", ()=>{ changeQty(b.dataset.inc, +1); renderCart(); });
    });
    root.querySelectorAll("[data-dec]").forEach(b=>{
      b.addEventListener("click", ()=>{ changeQty(b.dataset.dec, -1); renderCart(); });
    });
    root.querySelectorAll("[data-rem]").forEach(b=>{
      b.addEventListener("click", ()=>{ removeFromCart(b.dataset.rem); renderCart(); });
    });
  }
  
  /* ---------- CHECKOUT page ---------- */
  function renderCheckout(){
    const root = document.getElementById("checkoutPage");
    if(!root) return;

    const cart = getCart();
    if(cart.length === 0){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("checkout")}</h2>
          <p class="small">${t("empty_cart")}</p>
          <div class="hr"></div>
          <a class="btn btn--primary" href="produtos.html">${t("products")}</a>
        </div>
      `;
      return;
    }

    const totalsBase = cartTotals(cart);
    const user = getUser();

    root.innerHTML = `
      <div class="cardform cardform--wide">
        <div class="checkoutHead">
          <div>
            <h2 class="checkoutTitle">${t("checkout_title")}</h2>
            <p class="small checkoutSub">${t("checkout_terms")}</p>
          </div>
          <a class="btn btn--ghost" href="carrinho.html">${t("cart")}</a>
        </div>

        <div class="hr"></div>

        <div class="checkoutGrid">
          <div class="checkoutMain">
            <form id="checkoutForm" class="formgrid formgrid--1">
              <div class="checkoutSection">
                <div class="checkoutSection__head">
                  <div class="stepdot">1</div>
                  <h3 class="checkoutSection__title">${t("step1")}</h3>
                </div>
                <div class="formgrid">
                  <div class="field">
                    <div class="label">${t("first")}</div>
                    <input class="input" name="first" required />
                  </div>
                  <div class="field">
                    <div class="label">${t("last")}</div>
                    <input class="input" name="last" required />
                  </div>
                  <div class="field">
                    <div class="label">${t("email")}</div>
                    <input class="input" name="email" required value="${user?.email || ""}" />
                  </div>
                  <div class="field">
                    <div class="label">${t("phone")}</div>
                    <input class="input" name="phone" required />
                  </div>
                  <div class="field">
                    <div class="label">${t("doc")}</div>
                    <input class="input" name="doc" required />
                  </div>
                </div>
              </div>

              <div class="checkoutSection">
                <div class="checkoutSection__head">
                  <div class="stepdot">2</div>
                  <h3 class="checkoutSection__title">${t("step2")}</h3>
                </div>
                <div class="formgrid">
                  <div class="field" style="grid-column:1/-1">
                    <div class="label">${t("address1")}</div>
                    <input class="input" name="address1" required />
                  </div>
                  <div class="field" style="grid-column:1/-1">
                    <div class="label">${t("address2")}</div>
                    <input class="input" name="address2" />
                  </div>
                  <div class="field">
                    <div class="label">${t("city")}</div>
                    <input class="input" name="city" required />
                  </div>
                  <div class="field">
                    <div class="label">${t("state")}</div>
                    <input class="input" name="state" required />
                  </div>
                  <div class="field">
                    <div class="label">${t("zip")}</div>
                    <input class="input" name="zip" required />
                  </div>
                  <div class="field">
                    <div class="label">${t("country")}</div>
                    <input class="input" name="country" required value="Brazil" />
                  </div>
                </div>
              </div>

              <div class="checkoutSection">
                <div class="checkoutSection__head">
                  <div class="stepdot">3</div>
                  <h3 class="checkoutSection__title">${t("step3")}</h3>
                </div>

                <div class="segwrap" role="group" aria-label="${t("shipping_method")}">
                  <label class="seg">
                    <input type="radio" name="ship" value="std" checked />
                    <span class="seg__main">
                      <span class="seg__title">${t("ship_std")}</span>
                      <span class="seg__sub">+${money(7.90)}</span>
                    </span>
                  </label>
                  <label class="seg">
                    <input type="radio" name="ship" value="exp" />
                    <span class="seg__main">
                      <span class="seg__title">${t("ship_exp")}</span>
                      <span class="seg__sub">+${money(14.90)}</span>
                    </span>
                  </label>
                </div>
              </div>

              <div class="checkoutSection">
                <div class="checkoutSection__head">
                  <div class="stepdot">4</div>
                  <h3 class="checkoutSection__title">${t("step4")}</h3>
                </div>

                <div class="paychips" role="group" aria-label="${t("pay_method")}">
                  <button class="chip" type="button" data-pay="btc">⚡ ${t("pay_btc")}</button>
                  <button class="chip" type="button" data-pay="pix">${t("pay_pix")}</button>
                  <button class="chip" type="button" data-pay="boleto">${t("pay_boleto")}</button>
                  <button class="chip" type="button" data-pay="ted">${t("pay_ted")}</button>
                  <button class="chip" type="button" data-pay="doc">${t("pay_doc")}</button>
                  <button class="chip" type="button" data-pay="debit">💳 ${t("pay_debit")}</button>
                  <button class="chip" type="button" data-pay="credit">💳 ${t("pay_credit")}</button>
                </div>

                <div class="field" style="margin-top:10px">
                  <div class="label">${t("pay_method")}</div>
                  <select class="select" name="pay" id="paySelect">
                    <option value="btc">${t("pay_btc")}</option>
                    <option value="pix">${t("pay_pix")}</option>
                    <option value="boleto">${t("pay_boleto")}</option>
                    <option value="ted">${t("pay_ted")}</option>
                    <option value="doc">${t("pay_doc")}</option>
                    <option value="debit">${t("pay_debit")}</option>
                    <option value="credit">${t("pay_credit")}</option>
                  </select>
                </div>

                <div id="payHint" class="small checkoutHint"></div>
                <div id="payDetails" class="paybox" aria-live="polite"></div>
              </div>

              <div class="checkoutSticky">
                <button class="btn btn--primary btn--wide" type="submit">${t("place_order")}</button>
              </div>
            </form>
          </div>

          <aside class="checkoutAside">
            <div class="asideCard">
              <div class="asideTitle">${t("step5")}</div>
              <div class="small asideSub">${t("order_summary")}</div>
              <div class="hr"></div>

              <div class="asideItems small">
                ${cart.map(it=>{
                  const p = findProduct(it.productId);
                  const name = p ? t(p.name) : it.productId;
                  const v = it.variant || {};
                  const variantText = Object.values(v).filter(Boolean).map(x=>t(x)).join(" • ");
                  const line = (p ? p.price : 0) * it.qty;
                  return `
                    <div class="asideItem">
                      <div class="asideItem__name">
                        <div>${name}</div>
                        <div class="small muted">${variantText ? `(${variantText})` : ""}</div>
                      </div>
                      <div class="asideItem__meta">× ${it.qty}</div>
                      <div class="asideItem__price"><strong>${money(line)}</strong></div>
                    </div>
                  `;
                }).join("")}
              </div>

              <div class="hr"></div>
              <div class="totals">
                <div class="totals__row"><span>${t("subtotal")}</span><strong id="sumSubtotal">${money(totalsBase.subtotal)}</strong></div>
                <div class="totals__row"><span>${t("shipping")}</span><strong id="sumShip">${money(totalsBase.shipping)}</strong></div>
                <div class="totals__row"><span>${t("tax")}</span><strong id="sumTax">${money(totalsBase.tax)}</strong></div>
                <div class="hr"></div>
                <div class="totals__row totals__row--big"><span>${t("total")}</span><strong id="sumTotal">${money(totalsBase.total)}</strong></div>
              </div>

              <div class="asideBadges">
                <span class="pill">🔒 Sem chargeback</span>
                <span class="pill">🧾 Invoice</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    `;

    const form = root.querySelector("#checkoutForm");
    const paySel = root.querySelector("#paySelect");
    const shipInputs = root.querySelectorAll('input[name="ship"]');
    const payHint = root.querySelector("#payHint");
    const payDetails = root.querySelector("#payDetails");

    const sumShip = root.querySelector("#sumShip");
    const sumTotal = root.querySelector("#sumTotal");
    const sumSubtotal = root.querySelector("#sumSubtotal");
    const sumTax = root.querySelector("#sumTax");

    const chips = root.querySelectorAll(".chip[data-pay]");
    function syncChips(){
      chips.forEach(ch=>{
        const isOn = ch.dataset.pay === paySel.value;
        ch.classList.toggle("chip--on", isOn);
        if(isOn) ch.setAttribute("aria-pressed","true"); else ch.setAttribute("aria-pressed","false");
      });
    }
    chips.forEach(ch=>{
      ch.addEventListener("click", ()=>{
        paySel.value = ch.dataset.pay;
        paySel.dispatchEvent(new Event("change"));
        syncChips();
      });
    });

    function getShip(){
      const el = form.querySelector('input[name="ship"]:checked');
      return el ? el.value : "std";
    }

    function recalc(){
      const ship = getShip();
      const subtotal = totalsBase.subtotal;
      const shipping = ship === "exp" ? 14.90 : 7.90;
      const tax = subtotal > 0 ? subtotal * 0.06 : 0;
      const total = subtotal + shipping + tax;
      sumSubtotal.textContent = money(subtotal);
      sumShip.textContent = money(shipping);
      sumTax.textContent = money(tax);
      sumTotal.textContent = money(total);
    }

    function randDigits(n){
      let s="";
      for(let i=0;i<n;i++) s += Math.floor(Math.random()*10);
      return s;
    }

    function makeDemoLightningInvoice(totalUsd){
      // Demo invoice (NOT valid on the real Lightning Network).
      // Replace by integrating BTCPay Server / LNURL in production.
      const amount = Math.max(1, Math.round(totalUsd*100));
      return `lnbc${amount}n1p${randDigits(12)}${randDigits(12)}${randDigits(12)}`;
    }

    function makeDemoPix(){
      const key = `hempstore+${randDigits(6)}@pix.demo`;
      const payload = `00020126580014BR.GOV.BCB.PIX0136${key}5204000053039865802BR5920HEMP STORE DEMO6009SAO PAULO62130509HEMP${randDigits(4)}6304${randDigits(4)}`;
      return { key, payload };
    }

    function makeDemoBoleto(){
      const code = `${randDigits(5)}.${randDigits(5)} ${randDigits(5)}.${randDigits(6)} ${randDigits(5)}.${randDigits(6)} ${randDigits(1)} ${randDigits(14)}`;
      return { code };
    }

    function makeDemoBank(){
      return {
        bank:"Banco Demo 999",
        agency:`${randDigits(4)}-${randDigits(1)}`,
        account:`${randDigits(6)}-${randDigits(1)}`,
        holder:"HEMP STORE S.A.",
        doc:"00.000.000/0001-00"
      };
    }

    function renderPaymentDetails(){
      const ship = getShip();
      const subtotal = totalsBase.subtotal;
      const shipping = ship === "exp" ? 14.90 : 7.90;
      const tax = subtotal > 0 ? subtotal * 0.06 : 0;
      const total = subtotal + shipping + tax;

      const method = paySel.value;
      if(method === "btc"){
        // Keep checkout clean: no extra Lightning "receive" notices.
        payHint.textContent = "";
        const invoice = makeDemoLightningInvoice(total);
        payDetails.innerHTML = `
          <div class="paybox__grid">
            <div>
              <div class="paybox__title">${t("invoice_title")}</div>
              <div class="small">${t("pay_btc")}</div>
            </div>
            <div class="paybox__panel">
              <div class="label" style="margin-bottom:6px">${t("invoice_label")}</div>
              <textarea class="input paybox__invoice" readonly>${invoice}</textarea>
              <div class="paybox__actions">
                <button type="button" class="btn btn--ghost" id="copyInvoice">${t("invoice_copy")}</button>
                <a class="btn btn--primary" href="lightning:${invoice}">${t("open_wallet")}</a>
              </div>
              <div class="small" id="copyStatus" aria-live="polite"></div>
            </div>
          </div>
        `;
      } else {
        payHint.textContent = (method === "credit" || method === "debit") ? t("pay_hint_card") : t("pay_hint_fiat");
        const bank = makeDemoBank();
        const pix = makeDemoPix();
        const boleto = makeDemoBoleto();

        let fiatBlock = "";
        if(method === "credit" || method === "debit"){
          fiatBlock = `
            <div class="paybox__panel">
              <div class="paybox__title">${t("fiat_title")} — ${method === "debit" ? t("pay_debit") : t("pay_credit")}</div>
              <div class="small" style="margin-bottom:10px">(demo) Em produção, processe cartão via adquirente/gateway e só libere após confirmação.</div>
              <div class="formgrid">
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("card_name")}</div>
                  <input class="input" placeholder="${t("card_name_ph")}" />
                </div>
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("card_number")}</div>
                  <input class="input" inputmode="numeric" placeholder="0000 0000 0000 0000" />
                </div>
                <div class="field">
                  <div class="label">${t("card_exp")}</div>
                  <input class="input" inputmode="numeric" placeholder="MM/AA" />
                </div>
                <div class="field">
                  <div class="label">${t("card_cvv")}</div>
                  <input class="input" inputmode="numeric" placeholder="CVV" />
                </div>
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("card_installments")}</div>
                  <select class="select">
                    <option>1x</option><option>2x</option><option>3x</option><option>6x</option><option>12x</option>
                  </select>
                </div>
              </div>
            </div>
          `;
        } else if(method === "pix"){
          fiatBlock = `
            <div class="paybox__panel">
              <div class="paybox__title">${t("fiat_title")} — ${t("pay_pix")}</div>
              <div class="field">
                <div class="label">${t("fiat_pix_key")}</div>
                <input class="input" value="${pix.key}" readonly />
              </div>
              <div class="field">
                <div class="label">${t("fiat_pix_payload")}</div>
                <textarea class="input paybox__invoice" readonly>${pix.payload}</textarea>
              </div>
            </div>
          `;
        } else if(method === "boleto"){
          fiatBlock = `
            <div class="paybox__panel">
              <div class="paybox__title">${t("fiat_title")} — ${t("pay_boleto")}</div>
              <div class="field">
                <div class="label">${t("fiat_boleto_code")}</div>
                <textarea class="input paybox__invoice" readonly>${boleto.code}</textarea>
              </div>
              <div class="small">(demo) Em produção, gere boleto via seu banco/gateway.</div>
            </div>
          `;
        } else {
          fiatBlock = `
            <div class="paybox__panel">
              <div class="paybox__title">${t("fiat_title")} — ${method.toUpperCase()}</div>
              <div class="small" style="margin-bottom:10px">(demo) Use os dados abaixo para TED/DOC.</div>
              <div class="formgrid">
                <div class="field">
                  <div class="label">${t("fiat_bank_name")}</div>
                  <input class="input" value="${bank.bank}" readonly />
                </div>
                <div class="field">
                  <div class="label">${t("fiat_agency")}</div>
                  <input class="input" value="${bank.agency}" readonly />
                </div>
                <div class="field">
                  <div class="label">${t("fiat_account")}</div>
                  <input class="input" value="${bank.account}" readonly />
                </div>
                <div class="field">
                  <div class="label">${t("fiat_holder")}</div>
                  <input class="input" value="${bank.holder}" readonly />
                </div>
                <div class="field" style="grid-column:1/-1">
                  <div class="label">${t("fiat_cnpj")}</div>
                  <input class="input" value="${bank.doc}" readonly />
                </div>
              </div>
            </div>
          `;
        }

        // For non-BTC methods, keep the UI focused on the selected BRL/card method.
        // (No extra Lightning invoice / receive notices.)
        payDetails.innerHTML = `
          <div class="paybox__grid">
            ${fiatBlock}
          </div>
        `;
      }

      const copyBtn = payDetails.querySelector("#copyInvoice");
      const copyStatus = payDetails.querySelector("#copyStatus");
      if(copyBtn){
        copyBtn.addEventListener("click", async ()=>{
          const ta = payDetails.querySelector("textarea.paybox__invoice");
          const text = ta ? ta.value : "";
          try{
            await navigator.clipboard.writeText(text);
            if(copyStatus) copyStatus.textContent = t("invoice_copied");
          } catch(err){
            if(ta){ ta.focus(); ta.select(); }
            if(copyStatus) copyStatus.textContent = t("invoice_copied");
          }
        });
      }
    }

    shipInputs.forEach(r=>r.addEventListener("change", ()=>{ recalc(); renderPaymentDetails(); }));
    paySel.addEventListener("change", ()=>{ renderPaymentDetails(); syncChips(); });
    recalc();
    renderPaymentDetails();
    syncChips();

    form.addEventListener("submit", async (e)=>{
      e.preventDefault();

      const user = getUser();
      const tok = getToken();
      if(!user || !tok){
        // Save return URL and ask user to login
        try{ localStorage.setItem("hemp_return_after_login", location.href); }catch{}
        location.href = "login.html";
        return;
      }

      const cartNow = getCart();
      if(!cartNow.length){
        alert("Seu carrinho está vazio.");
        location.href = "produtos.html";
        return;
      }

      const fd = new FormData(form);
      const first = String(fd.get("first")||"").trim();
      const last  = String(fd.get("last")||"").trim();
      const phone = String(fd.get("phone")||"").trim();
      const address1 = String(fd.get("address1")||"").trim();
      const address2 = String(fd.get("address2")||"").trim();
      const city = String(fd.get("city")||"").trim();
      const state = String(fd.get("state")||"").trim().toUpperCase();
      const zipRaw = String(fd.get("zip")||"").trim();
      const method = String(fd.get("pay")||paySel.value||"pix");

      // Parse street + number from address1 (best effort)
      let street = address1, number = "s/n";
      const m = address1.match(/^(.*?)[,\s]+(\d+[\w\-\/]*)\s*$/);
      if(m){ street = m[1].trim() || street; number = m[2].trim() || number; }

      const zip = zipRaw.replace(/\D/g,"").slice(0,8);

      const addressPayload = {
        label: "Entrega",
        recipient: `${first} ${last}`.trim() || (user.email || "Cliente"),
        phone: phone || undefined,
        street: street || "Rua",
        number,
        complement: address2 || undefined,
        district: "Centro",
        city: city || "Cidade",
        state: (state && state.length===2) ? state : "SP",
        zip: zip || "00000000"
      };

      const provider = (method === "btc") ? "mock" : "mercadopago";

      try{
        // 1) Create address
        const addr = await apiFetch("/addresses", { method:"POST", body: JSON.stringify(addressPayload) });

        // 2) Create checkout
        const items = cartNow.map(i=>({ sku: i.productId, quantity: i.qty }));
        const chk = await apiFetch("/checkout", {
          method:"POST",
          body: JSON.stringify({
            addressId: addr.id,
            items,
            paymentProvider: provider,
            clientPaymentMethod: method
          })
        });

        // 3) For fiat, redirect to provider checkout
        if(provider === "mercadopago" && chk.checkoutUrl){
          location.href = chk.checkoutUrl;
          return;
        }

        // 4) Mock flow: auto-approve payment and go to success
        await apiFetch(`/webhooks/mock/approve?orderId=${encodeURIComponent(chk.orderId)}`, { method:"POST" });
        setCart([]);
        location.href = `checkout-success.html?orderId=${encodeURIComponent(chk.orderId)}`;
      }catch(err){
        alert((err && err.message) ? err.message : "Falha ao finalizar o pedido.");
      }
    });
  }

  /* ---------- Render all pages ---------- */
  
  /* ---------- Orders (My purchases) page ---------- */
  function renderOrdersPage(){
    const root = document.getElementById("ordersPage");
    if(!root) return;

    const user = getUser();
    const tok = getToken();
    if(!user || !tok){
      root.innerHTML = `
        <div class="cardform">
          <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
          <p class="small">Você precisa entrar para ver seu histórico.</p>
          <div class="hr"></div>
          <a class="btn btn--primary" href="login.html">${t("login")}</a>
        </div>
      `;
      return;
    }

    root.innerHTML = `
      <div class="cardform">
        <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
        <p class="small">Carregando…</p>
      </div>
    `;

    apiFetch("/orders")
      .then((orders)=>{
        if(!Array.isArray(orders) || orders.length===0){
          root.innerHTML = `
            <div class="cardform">
              <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
              <p class="small">Nenhum pedido encontrado.</p>
              <div class="hr"></div>
              <a class="btn btn--primary" href="produtos.html">${t("products")}</a>
            </div>
          `;
          return;
        }

        const rows = orders.map(o=>{
          const when = o.createdAt ? new Date(o.createdAt).toLocaleString() : "";
          const total = (o.totalCents||0)/100;
          const items = Array.isArray(o.items) ? o.items.map(i=>`<div class="small" style="opacity:.9">• ${escapeHTML(i.name||i.sku)} × ${i.quantity}</div>`).join("") : "";
          const pay = o.paymentStatus ? `<span class="badge">${escapeHTML(o.paymentStatus)}</span>` : "";
          const ln = o.lightningStatus ? `<span class="badge">${escapeHTML(o.lightningStatus)}</span>` : "";
          return `
            <div class="orderCard">
              <div class="orderCard__top">
                <div>
                  <div class="orderCard__id">#${escapeHTML(o.id)}</div>
                  <div class="small">${when}</div>
                </div>
                <div style="text-align:right">
                  <div class="orderCard__total">${money(total)}</div>
                  <div class="small">${escapeHTML(o.status||"")}</div>
                </div>
              </div>
              <div class="orderCard__meta">${pay} ${ln}</div>
              <div class="hr"></div>
              <div>${items}</div>
            </div>
          `;
        }).join("");

        root.innerHTML = `
          <div class="cardform">
            <h2 style="margin:0 0 12px">${t("my_orders")}</h2>
            ${rows}
          </div>
        `;
      })
      .catch((err)=>{
        root.innerHTML = `
          <div class="cardform">
            <h2 style="margin:0 0 8px">${t("my_orders")}</h2>
            <p class="small">Falha ao carregar pedidos: ${escapeHTML(err?.message||"")}</p>
          </div>
        `;
      });
  }

  function escapeHTML(s){
    return String(s||"").replace(/[&<>"']/g, (c)=>({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
  }

function pageRenderAll(){
    renderHome();
    renderProductsList();
    renderProductPage();
    renderLogin();
    renderCart();
    renderCheckout();
    renderOrdersPage();
    mountAuthUI();
    updateCartBadge();
  }
  

  /* ---------- Smart Footer + Newsletter ---------- */
  function mountSmartFooter(){
    const footer = document.getElementById("siteFooter");
    if(!footer) return;

    const yearEl = document.getElementById("footerYear");
    if(yearEl) yearEl.textContent = String(new Date().getFullYear());

    const site = (document.body && document.body.dataset && document.body.dataset.site) || "";
    const path = (location.pathname || "").toLowerCase();
    const isHoc = site === "hoc" || path.includes("hemp-oil-company") || path.includes("hoc-");

    const brandEl = document.getElementById("footerBrand");
    const descEl = document.getElementById("footerDesc");
    const copyEl = document.getElementById("footerCopy");

    if(isHoc){
      if(brandEl) brandEl.textContent = "Hemp Oil Company S.A.";
      if(descEl) descEl.textContent = t("footer_desc_hoc");
      if(copyEl) copyEl.innerHTML = `© <span id="footerYear">${new Date().getFullYear()}</span> Hemp Oil Company S.A.`;
      const nav = document.getElementById("footerNav");
      if(nav){
        nav.innerHTML = `
          <li><a href="hemp-oil-company.html">${t("home")}</a></li>
          <li><a href="hoc-solucoes.html">Soluções</a></li>
          <li><a href="hoc-compliance.html">P&amp;D + Compliance</a></li>
          <li><a href="hemp-oil-company.html#contato">${t("contact")}</a></li>
          <li><a href="produtos.html">${t("products")}</a></li>
        `;
      }
    }else{
      if(brandEl) brandEl.textContent = "HEMP Store";
      if(descEl) descEl.textContent = t("footer_desc_store");
      if(copyEl) copyEl.innerHTML = `© <span id="footerYear">${new Date().getFullYear()}</span> Hemp Store S.A.`;
    }
  }

  function mountNewsletter(){
    const email = document.getElementById("newsletterEmail");
    const btn = document.getElementById("newsletterBtn");
    const status = document.getElementById("newsletterStatus");
    if(!email || !btn || !status) return;

    const key = "hemp_newsletter_emails";
    const valid = (v)=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||"").trim());

    btn.addEventListener("click", ()=>{
      const v = String(email.value||"").trim();
      status.textContent = "";
      status.classList.remove("ok","bad");
      if(!valid(v)){
        status.textContent = t("newsletter_invalid");
        status.classList.add("bad");
        return;
      }
      try{
        const list = JSON.parse(localStorage.getItem(key) || "[]");
        if(!list.includes(v)) list.push(v);
        localStorage.setItem(key, JSON.stringify(list));
      }catch{}
      status.textContent = t("newsletter_success");
      status.classList.add("ok");
      email.value = "";
    });
  }




/* ---------- Product back navigation ---------- */
function mountProductBackNav(){
  // Store the current page as the "back" target whenever the user opens a product page
  document.addEventListener("click", (e)=>{
    const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if(!a) return;
    const href = a.getAttribute("href") || "";
    if(/(^|\/)(produto\.html)(\?|#|$)/i.test(href)){
      try{ sessionStorage.setItem("productBackUrl", location.href); }catch{}
    }
  }, true);

  const backLink = document.getElementById("backLink");
  if(!backLink) return;

  backLink.addEventListener("click", (e)=>{
    e.preventDefault();

    const here = location.href;

    let stored = null;
    try{
      stored = sessionStorage.getItem("productBackUrl") || sessionStorage.getItem("lastProductsUrl");
    }catch{}

    if(stored && stored !== here){
      location.href = stored;
      return;
    }

    if(document.referrer){
      try{
        const r = new URL(document.referrer, location.href);
        const c = new URL(location.href);
        if(r.origin === c.origin && r.href !== here){
          location.href = r.href;
          return;
        }
      }catch{}
    }

    if(history.length > 1){
      history.back();
      return;
    }

    location.href = "produtos.html";
  });
}

  /* ---------- INIT ---------- */
  (function init(){
    applyI18nStatic();
    syncLangButton();
    mountLangModal();
    mountCurrencyModal();
    mountAuthUI();
    updateCartBadge();
    pageRenderAll();
    mountSmartFooter();
    initFooterSearch();
    mountNewsletter();
  })();
  