const { Gradient } = require("@mui/icons-material");
const { Card } = require("@mui/material");
const plugin = require("tailwindcss/plugin");

module.exports = {
  important: false,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      notebook: { max: "1366px" },
      minnotebook: { min: "1366px" },
      monitor: { min: "1810px" },
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px"
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      boxShadow: {
        shadowBox: "var(--shadow-box)",
        ["elevation-4"]:
          "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
        ["elevation-6"]:
          "0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)",
        ["elevation-8"]:
          "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)",
        ["elevation-12"]:
          "0px 7px 8px -4px rgb(0 0 0 / 20%), 0px 12px 17px 2px rgb(0 0 0 / 14%), 0px 5px 22px 4px rgb(0 0 0 / 12%)"
      },
      backgroundImage: {
        //'nws-image': "url('https://cdn.pixabay.com/photo/2016/01/19/17/46/industrial-plant-1149888_960_720.jpg')",
        background: "var(--background-color)",
        "nws-image": "url('/src/assets/images/fondo.jpg')",
        linearGradientHeaderTable: "linear-gradient(90deg, #5C79C8 10.51%, #3AA4D3 85.51%)",
        linearGradientHaderPage: "linear-gradient(270deg, #162D55 0%, #227DEE 98.36%)",
        "footer-texture": "url('/img/footer-texture.png')",
        navBarInicio: "('--bar-navigate-wit-blue-gradient')",
        backGroundRegistroPlacas: "var(--background-color-registro-placas)"
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))"
      },
      textColor: {
        textColor: "var(--text-color)",
        mainColorInit: "var(--main-color-init)",
        textColorMainPage: "var(--text-color-main-page)",
        colorInfoIcon: "var(--color-info-icon)",
        subtitleTextModules: "var(--text-color-subtitle-modules)"
      },
      width: {
        "10vw": "10vw",
        "25vw": "25vw",
        "33vw": "33vw",
        "50vw": "50vw",
        "66vw": "66vw",
        "75vw": "75vw",
        "90vw": "90vw"
      },
      height: {
        "10vh": "10vh",
        "25vh": "25vh",
        "33vh": "33vh",
        "50vh": "50vh",
        "66vh": "66vh",
        "75vh": "75vh",
        "90vh": "90vh"
      },
      backgroundColor: {
        primaryNew: "var(--primary-color)",
        primaryNewOpacity: "var(--primary-color-opacity)",
        secondaryNew: "var(--secondary-color)",

        backgroundHorasExtras: "var(--background-color-horas-extras)",
        backgroundHorasExtrasSelect: "var(--background-color-horas-extras-select)",

        backgroundForAudit: "var(--background-for-audit)",
        backgroundModalAudit: "var(--background-modal-audit)",
        backgroundColorButtonCloseModal: "var(--background-color-button-close-modal)",

        New: "var(--background-New)",
        NewSecondary: "var(--background-New-Secondary)",
        NewPrimary: "var(--background-New-Primary)",
        NewTertiary: "var(--background-New-Tertiary)",
        Card: "var(--background-Card)",
        colorTableTop: "var(--table-color-top)",
        colorTableBottom: "var(--table-color-bottom)",

        //Colores Botones
        buttonSelectorGraphics: "var(--button-selector-graphics)",

        background: "var(--background-color)",
        dangerNew: "var(--danger-color)",
        textColor: "var(--text-color)",
        backgroundColorMessageTicket: "var(--background-input-message-ticket)",

        newsanLighten: "var(--newsanLighten-color)",
        newsan: "var(--newsan-color)",
        newsanColorMidSubtitle: "var(--newsan-color-mid-subtitle)",

        backgroundColorTableHeaderPlanProdSpp: "var(--background-color-tableHeader-planProdSpp)",
        backgroundTablePlanProdSpp: "var(--background-color-table-planProdSpp)",
        backgroundTableSelectedPlanProdSpp: "(--background-color-tableSelected-planProdSpp)",
        backgroundTableAGC: "var(--background-color-tableAGC)",

        reporte: "var(--background-color-reporte)",
        reporteLetra: "var(--background-color-reporte-letra)",
        mensajeTicketsRemito: "var(--fondo-mensajes-tickets-propio)",
        mensajeTicketsReceptor: "var(--fondo-mensajes-tickets-receptor)",
        fondoInformacionTicket: "var(--fondo-informacion-ticket)",
        fondoTicketNotificacion: "var(--fondo-notifiaciones-no-leidas)"
      },

      boxShadow: {
        shadowBox: "var(--shadow-box)",
        Box: "var(--shadow)"
      },

      colors: {
        primaryNewOpacity: "var(--primary-color-opacity)",
        primaryNew: "var(--primary-color)",
        secondaryNew: "var(--secondary-color)",
        background: "var(--background-color)",
        dangerNew: "var(--danger-color)",
        textColor: "var(--text-color)",
        textColorOpposite: "var(--text-color-opposite)",
        textNew: "var(--text-color-new)",
        newsanLighten: "var(--newsanLighten-color)",
        newsan: "var(--newsan-color)",
        newsanColorMidSubtitle: "var(--newsan-color-mid-subtitle)",
        divider: "var(--border-divider)",
        reporte: "var(--background-color-reporte)",
        reporteLetra: "var(--background-color-reporte-letra)"
      },
      gradientColorStops: {
        primaryNew: "var(--primary-color)",
        secondaryNew: "var(--secondary-color)",
        background: "var(--background-color)",
        textColor: "var(--text-color)",
        dangerNew: "var(--danger-color)",
        newsanLighten: "var(--newsanLighten-color)",
        newsan: "var(--newsan-color)"
      },
      scale: { 200: "2" }
    }
  },
  plugins: [
    plugin(function ({ matchVariant }) {
      matchVariant(
        "nth",
        (value) => {
          return `&>*:nth-child(${value})`;
        },
        {
          values: {
            odd: "odd",
            even: "even"
          }
        }
      );
    })
  ]
};
