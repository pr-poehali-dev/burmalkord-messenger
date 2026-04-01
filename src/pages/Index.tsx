import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "Sparkles",
      title: "Уникальный дизайн",
      desc: "Каждый проект создаётся индивидуально — без шаблонов и безликих решений.",
    },
    {
      icon: "Zap",
      title: "Быстрый запуск",
      desc: "От идеи до готового сайта — за считанные дни, не месяцы.",
    },
    {
      icon: "Shield",
      title: "Надёжность",
      desc: "Современный стек технологий, поддержка и развитие после запуска.",
    },
    {
      icon: "Heart",
      title: "С душой",
      desc: "Мы вкладываем смысл в каждую деталь, которую видит ваш пользователь.",
    },
  ];

  const works = [
    { label: "Проекты", value: "47+" },
    { label: "Лет опыта", value: "8" },
    { label: "Довольных клиентов", value: "39" },
    { label: "Чашек кофе", value: "∞" },
  ];

  return (
    <div className="min-h-screen bg-studio-bg text-studio-text font-golos overflow-x-hidden">

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-studio-bg/90 backdrop-blur-md border-b border-studio-border" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <span className="font-cormorant text-2xl font-semibold tracking-widest text-studio-gold uppercase">
            Студия
          </span>
          <div className="hidden md:flex items-center gap-8 text-sm text-studio-muted">
            <a href="#about" className="hover:text-studio-text transition-colors">О нас</a>
            <a href="#features" className="hover:text-studio-text transition-colors">Услуги</a>
            <a href="#contact" className="hover:text-studio-text transition-colors">Контакты</a>
          </div>
          <a
            href="#contact"
            className="btn-primary text-sm px-5 py-2.5 rounded-full"
          >
            Обсудить проект
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-studio-gold/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-studio-accent/10 rounded-full blur-[100px] pointer-events-none" />
        {/* grain overlay */}
        <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-studio-border bg-studio-surface mb-10 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-studio-gold animate-pulse" />
            <span className="text-xs tracking-widest uppercase text-studio-muted font-medium">
              Веб‑студия нового поколения
            </span>
          </div>

          <h1
            className="font-cormorant text-6xl md:text-8xl lg:text-[110px] leading-[0.95] font-light text-studio-text mb-8"
            style={{ animationDelay: "0.1s" }}
          >
            Мы создаём
            <br />
            <em className="text-studio-gold not-italic">цифровые</em>
            <br />
            пространства
          </h1>

          <p className="text-studio-muted text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
            Сайты, интерфейсы и бренды, которые западают в память
            и работают на ваш бизнес годами.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#contact" className="btn-primary px-8 py-4 rounded-full text-base font-medium group">
              Начать проект
              <Icon name="ArrowRight" size={18} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#features" className="btn-ghost px-8 py-4 rounded-full text-base">
              Посмотреть работы
            </a>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs tracking-widest uppercase">Скролл</span>
          <Icon name="ChevronDown" size={16} className="animate-bounce" />
        </div>
      </section>

      {/* STATS */}
      <section id="about" className="py-16 border-y border-studio-border bg-studio-surface/50">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {works.map((w) => (
            <div key={w.label} className="text-center">
              <div className="font-cormorant text-5xl md:text-6xl font-semibold text-studio-gold mb-1">
                {w.value}
              </div>
              <div className="text-studio-muted text-sm tracking-wide">{w.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <p className="text-studio-gold text-xs tracking-[0.25em] uppercase mb-4">Что мы делаем</p>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light leading-tight max-w-lg">
              Подход, который<br /><em className="not-italic text-studio-gold">отличает</em> нас
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-studio-border rounded-2xl overflow-hidden">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-studio-bg p-8 md:p-10 group hover:bg-studio-surface transition-colors duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-studio-gold/10 border border-studio-gold/20 flex items-center justify-center mb-6 group-hover:bg-studio-gold/20 transition-colors">
                  <Icon name={f.icon as any} size={22} className="text-studio-gold" />
                </div>
                <h3 className="font-cormorant text-2xl font-semibold mb-3 text-studio-text">
                  {f.title}
                </h3>
                <p className="text-studio-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE BAND */}
      <section className="py-20 border-y border-studio-border bg-studio-gold/5 overflow-hidden relative">
        <div className="absolute inset-0 noise-bg opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Icon name="Quote" size={40} className="text-studio-gold/40 mx-auto mb-6" />
          <blockquote className="font-cormorant text-3xl md:text-5xl font-light leading-snug text-studio-text italic mb-6">
            «Дизайн — это не то, как вещь выглядит.<br />
            Это то, как она работает.»
          </blockquote>
          <cite className="text-studio-muted text-sm tracking-widest uppercase not-italic">
            — Стив Джобс
          </cite>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-14">
            <p className="text-studio-gold text-xs tracking-[0.25em] uppercase mb-4">Связаться</p>
            <h2 className="font-cormorant text-5xl md:text-6xl font-light leading-tight">
              Расскажите<br />о вашем <em className="not-italic text-studio-gold">проекте</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-xs tracking-widest uppercase text-studio-muted mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  placeholder="Иван Иванов"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="studio-input"
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-studio-muted mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="hello@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="studio-input"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-xs tracking-widest uppercase text-studio-muted mb-2">
                Сообщение
              </label>
              <textarea
                rows={5}
                placeholder="Опишите задачу или идею..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="studio-input flex-1 resize-none"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <button className="btn-primary px-10 py-4 rounded-full text-base font-medium group">
              Отправить
              <Icon name="Send" size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-studio-muted text-sm">
              Ответим в течение 24 часов
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-studio-border py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-cormorant text-xl font-semibold tracking-widest text-studio-gold uppercase">
            Студия
          </span>
          <p className="text-studio-muted text-sm">
            © {new Date().getFullYear()} — Все права защищены
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-studio-muted hover:text-studio-text transition-colors">
              <Icon name="Instagram" size={18} />
            </a>
            <a href="#" className="text-studio-muted hover:text-studio-text transition-colors">
              <Icon name="Send" size={18} />
            </a>
            <a href="#" className="text-studio-muted hover:text-studio-text transition-colors">
              <Icon name="Globe" size={18} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Index;
