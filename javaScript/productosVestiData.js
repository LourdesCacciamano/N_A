// ============================================================
// DATOS DE PRODUCTOS - VESTIMENTA
// ============================================================.
//
// Cada producto usa el MISMO id que ya tenías en data-id="" en
// vestimentaNA.html.
//
// imgs: array de fotos (arma el carrusel solo, en el mismo orden)
// talles: array de talles, o [] si el producto no usa talle
// colores: array de { nombre, clase } - la "clase" tiene que ser
//          una de las que ya existen en tu SCSS: negro, blanco,
//          gris, marron, rosa, rojo. Vacío [] si no aplica.
// ============================================================

const PRODUCTOS_VESTI = [
    {
        id: 201,
        titulo: "REMERA HOMBRE NEGRA",
        precio: 33000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764105816/NA/remeraHombre_e1wivu.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764105861/NA/2_pqgvxq.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764105732/NA/talles-hombre_naiwdl.jpg"
        ],
        talles: ["S", "M", "L"],
        colores: []
    },
    {
        id: 202,
        titulo: "REMERA COMPRESIÓN",
        precio: 29000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1771430570/NA/remeraNegraNa_ji2mve.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1771430630/NA/remeraBlancaNa_bf35ej.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1771430684/NA/remeraGrisNa_mfwdkj.jpg"
        ],
        talles: ["S", "M", "L"],
        colores: [
            { nombre: "Negro", clase: "negro" },
            { nombre: "Blanco", clase: "blanco" },
            { nombre: "Gris", clase: "gris" }
        ]
    },
    {
        id: 203,
        titulo: "MUSCULOSA COMPRESIÓN NEGRA",
        precio: 29000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1771430703/NA/musculosaNegraNa_kinxhy.jpg"
        ],
        talles: ["S", "M", "L"],
        colores: []
    },
    {
        id: 204,
        titulo: "TOP DEPORTIVO",
        precio: 26000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1771430726/NA/topsNa_t9n7qr.jpg"
        ],
        talles: ["S", "M"],
        colores: [
            { nombre: "Negro", clase: "negro" },
            { nombre: "Blanco", clase: "blanco" },
            { nombre: "Marrón", clase: "marron" }
        ]
    },
    {
        id: 205,
        titulo: "SHORT DEPORTIVO",
        precio: 26000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1771430656/NA/shortNA_uosxz2.jpg"
        ],
        talles: ["S", "M"],
        colores: [
            { nombre: "Negro", clase: "negro" },
            { nombre: "Blanco", clase: "blanco" },
            { nombre: "Marrón", clase: "marron" },
            { nombre: "Gris", clase: "gris" }
        ]
    },
    {
        id: 206,
        titulo: "REMERA MUJER",
        precio: 25000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764105953/NA/remeraMujer_rwhnny.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764106016/NA/remeraAtrasMujer_tpurkz.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764191401/NA/remeraMujerBlanco_yoiaas.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1764106059/NA/talleMujer_sxbbth.jpg"
        ],
        talles: ["S", "M"],
        colores: [
            { nombre: "Negro", clase: "negro" },
            { nombre: "Blanco", clase: "blanco" }
        ]
    },
    {
        id: 207,
        titulo: "GUANTES DE ENTRENAMIENTO",
        precio: 17000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1778599885/NA/WhatsApp_Image_2026-05-02_at_12.00.46_gkyodr_8db7ee.jpg"
        ],
        talles: ["S", "M", "L"],
        colores: [
            { nombre: "Negro", clase: "negro" },
            { nombre: "Rosa", clase: "rosa" }
        ]
    },
    {
        id: 208,
        titulo: "STRAPS DE LEVANTAMIENTO",
        precio: 17500,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1778600939/NA/WhatsApp_Image_2026-05-02_at_12.00.45_usdfu7_8f1731_977474.jpg",
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1778601030/NA/WhatsApp_Image_2026-05-02_at_12.00.45_1_ydgiv4_a7e212_96476f.jpg"
        ],
        talles: [],
        colores: [
            { nombre: "Negro", clase: "negro" },
            { nombre: "Rojo", clase: "rojo" },
            { nombre: "Rosa", clase: "rosa" }
        ]
    },
    {
        id: 209,
        titulo: "MUÑEQUERA DE LEVANTAMIENTO",
        precio: 20000,
        imgs: [
            "https://res.cloudinary.com/dhxbif0h1/image/upload/v1778608498/NA/WhatsApp_Image_2026-05-02_at_12.00.44_xkbyht_595949.jpg"
        ],
        talles: [],
        colores: [
            { nombre: "Negro", clase: "negro" }
        ]
    }
];