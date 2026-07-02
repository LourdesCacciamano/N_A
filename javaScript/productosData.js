// ============================================================
// DATOS DE PRODUCTOS 
// ============================================================
// Cada producto usa el MISMO id que ya tenés en data-id="" en suplementos.html
// Si agregás un producto nuevo a la página, agregalo también acá con el
// mismo id que le pongas al botón .botonSupJs.

function fmtPrecio(n) {
    return '$' + n.toLocaleString('es-AR');
}

const PRODUCTOS_NA = [
    //PROTEINAS
    {
        id: 1,
        categoria: "Proteínas",
        titulo: "WHEY PROTEIN",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1782931073/NA/ceb4c583-81b6-4d51-b9a0-0096dc5a9c01_kfj2uf.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 1kg",
        precioViejo: 75000,
        precio: 65000,
        sabores: ["Vainilla", "Frutilla", "Chocolate"]
    },
    {
        id: 2,
        categoria: "Proteínas",
        titulo: "WHEY PROTEIN",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1782945134/NA/whey-protein-hochsport-chocolate_nb6zgl.jpg",
        marca: "- Marca: HOCH SPORT",
        contenido: "- Contiene: 1kg",
        precioViejo: null,
        precio: 55000,
        sabores: ["Vainilla", "Frutos Rojos", "Chocolate", "Dulce de Leche"]
    },
    {
        id: 3,
        categoria: "Proteínas",
        titulo: "WHEY PROTEIN",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1782931073/NA/e2d97b7b-7d63-4678-8615-6f67d8247c15_ett7sl.jpg",
        marca: "- Marca: ONE FIT",
        contenido: "- Contiene: 1kg",
        precioViejo: null,
        precio: 46500,
        sabores: ["Vainilla", "Frutos Rojos", "Chocolate"]
    },
    {
        id: 4,
        categoria: "Proteínas",
        titulo: "EXTREME MASS",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1782944844/NA/extreme-mass-hochsport_mssmuh.jpg",
        marca: "- Marca: HOCH SPORT",
        contenido: "- Contiene: 1.5kg",
        precioViejo: 38500,
        precio: 33800,
        sabores: ["Vainilla", "Frutos Rojos"]
    },
    //CREATINAS
    {
        id: 5,
        categoria: "Creatinas",
        titulo: "CREATINA",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772570034/NA/C-startNutrition_mlzhs7_c845e5.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 300g - Sin sabor",
        precioViejo: 38000,
        precio: 30000,
        sabores: []
    },
    {
        id: 6,
        categoria: "Creatinas",
        titulo: "CREATINA",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772570153/NA/C-creatina-hochSport_qcg7ud_433ba2.jpg",
        marca: "- Marca: HOCH SPORT",
        contenido: "- Contiene: 300g - Sin sabor",
        precioViejo: 38000,
        precio: 33000,
        sabores: []
    },
    {
        id: 7,
        categoria: "Creatinas",
        titulo: "CREATINA",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1782931073/NA/crea-oneFit_fnso69.jpg",
        marca: "- Marca: ONE FIT",
        contenido: "- Contiene: 200g <br> - Sin Sabor",
        precioViejo: null,
        precio: 20000,
        sabores: []
    },
    // OTROS
    {
        id: 8,
        categoria: "Otros",
        titulo: "MULTIVITAMINICO",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1773140833/NA/multivitaminicoO_ztfqly_e7884f.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 60 cápsulas",
        precioViejo: null,
        precio: 25200,
        sabores: []
    },
    {
        id: 9,
        categoria: "Otros",
        titulo: "THERMOGENIX",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772568900/NA/O-thermogenix-hochSport_ljidnw_6ca868_798628_bbd7e5.jpg",
        marca: "- Marca: HOCH SPORT",
        contenido: "- Contiene: 120 cápsulas",
        precioViejo: null,
        precio: 32000,
        sabores: []
    },
    {
        id: 10,
        categoria: "Otros",
        titulo: "COLÁGENO PURO",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772569833/NA/O-colagenoPuro-nucleoFit_h6ppwi_a07234_9b8795_fa2fb0_c99f95.jpg",
        marca: "- Marca: NUCLEO FIT",
        contenido: "- Contiene: 300g - Sin sabor",
        precioViejo: null,
        precio: 26000,
        sabores: []
    },
    {
        id: 11,
        categoria: "Otros",
        titulo: "PRE ENTRENO TNT DYNAMITE",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772569323/NA/O-preEntrenoTNTDynamite-startNutrition_uctevs_6be827_14c798_59460d_33e955_124015.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 240g",
        precioViejo: 34000,
        precio: 29000,
        sabores: ["Uva", "Limón"]
    },
    {
        id: 12,
        categoria: "Otros",
        titulo: "PRE ENTRENO PUMP V8",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772569453/NA/O-preEntrenoPumpV8-startNutrition_cybbnd_7e8c30.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 285g",
        precioViejo: null,
        precio: 34000,
        sabores: ["Uva", "Limón", "Sandía"]
    },
    {
        id: 14,
        categoria: "Otros",
        titulo: 'SHAKER "VASOS"',
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772567363/NA/O-vasosShakers-Everlast_wuuycy_094028.jpg",
        marca: "- Marca: EVERLAST",
        contenido: "- Contiene: 450ml",
        precioViejo: null,
        precio: 18600,
        sabores: ["Gris", "Azul Oscuro", "Turquesa"],
        etiquetaSabor: "Color"
    },
    {
        id: 15,
        categoria: "Otros",
        titulo: "CITRATO DE MAGNESIO",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1772569926/NA/O-citratoMagnesio-startNutrition_abbwtd_e9a24f.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 60 cápsulas",
        precioViejo: null,
        precio: 18500,
        sabores: []
    },
    {
        id: 13,
        categoria: "Otros",
        titulo: "OMEGA 3",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1773140794/NA/omega3O_jvgb0g_8319af.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene: 60 cápsulas",
        precioViejo: null,
        precio: 34500,
        sabores: []
    },
    {
        id: 16,
        categoria: "Otros",
        titulo: "CITRATO DE MAGNESIO",
        img: "https://res.cloudinary.com/dhxbif0h1/image/upload/v1778598722/NA/WhatsApp_Image_2026-05-02_at_12.00.45_2_pkpiqo_78024b.jpg",
        marca: "- Marca: STAR NUTRITION",
        contenido: "- Contiene 500g en Polvo - Sabor: Sin Sabor",
        precioViejo: 35000,
        precio: 31800,
        sabores: []
    }
];

// PARA REUTILIZAR
/*
id: ,
categoria: ,
titulo: ,
img: "",
marca: ,
contenido: ,
precioViejo: ,
precio: ,
sabores: []
*/ 