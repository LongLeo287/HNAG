import type { CandidateItem } from "./schema";

/** Reviewed against the imported name/description; see docs/reference-notes/catalog-classification.md.
 * Exact IDs/names keep curation separate from the original import. No runtime name guessing. */
export const CLASSIFICATION_CORRECTIONS: Readonly<Record<string, { expectedName: string } & Partial<Pick<CandidateItem, "kind" | "categoryId" | "enabled">>>> = {
  "banh-mi-thit": {
    "expectedName": "Bánh mì thịt",
    "categoryId": "banh-mi"
  },
  "banh-canh-cua": {
    "expectedName": "Bánh canh cua",
    "categoryId": "chao-sup"
  },
  "che-thap-cam": {
    "expectedName": "Chè thập cẩm",
    "categoryId": "trang-mieng"
  },
  "hnag-0002": {
    "expectedName": "Mỳ Chũ Bắc Giang xào thịt bò",
    "categoryId": "pho-mi"
  },
  "hnag-0016": {
    "expectedName": "Bánh mì dân tổ",
    "categoryId": "banh-mi"
  },
  "hnag-0046": {
    "expectedName": "Cốm làng Vòng / Chè cốm",
    "categoryId": "trang-mieng",
    "kind": "FOOD"
  },
  "hnag-0049": {
    "expectedName": "Kem Tràng Tiền / Kem Thủy Tạ",
    "categoryId": "trang-mieng"
  },
  "hnag-0057": {
    "expectedName": "Bún lòng lợn tiết canh",
    "categoryId": "bun"
  },
  "hnag-0066": {
    "expectedName": "Bia hơi Hà Nội kèm Lạc luộc / Nem chua rán",
    "categoryId": "co-con",
    "enabled": false
  },
  "hnag-0067": {
    "expectedName": "Bia hơi vỉa hè Tạ Hiện kèm Lạc luộc / Nem chua rán",
    "categoryId": "co-con",
    "enabled": false
  },
  "hnag-0068": {
    "expectedName": "Bia hơi vỉa hè Tạ Hiện nem chua rán",
    "categoryId": "co-con",
    "enabled": false
  },
  "hnag-0081": {
    "expectedName": "Gà Đông Tảo luộc / Hầm thuốc bắc",
    "categoryId": "mon-man"
  },
  "hnag-0083": {
    "expectedName": "Chè sen long nhãn Hưng Yên",
    "categoryId": "trang-mieng"
  },
  "hnag-0102": {
    "expectedName": "Bánh mì que cay Hải Phòng",
    "categoryId": "banh-mi"
  },
  "hnag-0103": {
    "expectedName": "Bánh mì que patê cay Cột Đèn",
    "categoryId": "banh-mi"
  },
  "hnag-0104": {
    "expectedName": "Chè dừa dầm Hải Phòng",
    "categoryId": "trang-mieng"
  },
  "hnag-0161": {
    "expectedName": "Đọt su su Tam Đảo xào tỏi",
    "categoryId": "mon-man"
  },
  "hnag-0162": {
    "expectedName": "Rau su su Tam Đảo xào tỏi / Luộc",
    "categoryId": "mon-man"
  },
  "hnag-0163": {
    "expectedName": "Tép dầu đầm Vạc kho tương",
    "categoryId": "mon-man"
  },
  "hnag-0184": {
    "expectedName": "Canh ngán nấu mồng tơi / Rượu ngán",
    "kind": "FOOD",
    "categoryId": "chao-sup",
    "enabled": false
  },
  "hnag-0185": {
    "expectedName": "Rượu ba kích Ba Chẽ",
    "categoryId": "co-con"
  },
  "hnag-0205": {
    "expectedName": "Rượu ngô men lá Quản Bạ",
    "categoryId": "co-con"
  },
  "hnag-0252": {
    "expectedName": "Chè bột lọc bọc heo quay",
    "categoryId": "trang-mieng"
  },
  "hnag-0253": {
    "expectedName": "Chè heo quay đường phèn",
    "categoryId": "trang-mieng"
  },
  "hnag-0255": {
    "expectedName": "Vả trộn chay Huế",
    "categoryId": "mon-man"
  },
  "hnag-0256": {
    "expectedName": "Chè cung đình Huế 36 món",
    "categoryId": "trang-mieng"
  },
  "hnag-0257": {
    "expectedName": "Chè hạt sen long nhãn bọc",
    "categoryId": "trang-mieng"
  },
  "hnag-0275": {
    "expectedName": "Rượu Bàu Đá Bình Định",
    "categoryId": "co-con"
  },
  "hnag-0297": {
    "expectedName": "Mật nho / Rượu nho Phan Rang",
    "categoryId": "co-con",
    "enabled": false
  },
  "hnag-0298": {
    "expectedName": "Nước yến sào đảo yến Khánh Hòa",
    "categoryId": "nuoc-khac"
  },
  "hnag-0317": {
    "expectedName": "Cao lầu Hội An thịt xá xíu",
    "categoryId": "pho-mi"
  },
  "hnag-0318": {
    "expectedName": "Cao lầu Hội An xá xíu",
    "categoryId": "pho-mi"
  },
  "hnag-0332": {
    "expectedName": "Chè sầu Liên sầu riêng thạch dừa",
    "categoryId": "trang-mieng"
  },
  "hnag-0341": {
    "expectedName": "Chè thạch dừa sương sa hạt lựu",
    "categoryId": "trang-mieng"
  },
  "hnag-0342": {
    "expectedName": "Chè sầu Liên (Sầu riêng Đà Nẵng)",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0359": {
    "expectedName": "Gỏi cà đắng cá cơm khô",
    "categoryId": "mon-man"
  },
  "hnag-0361": {
    "expectedName": "Bánh mì xíu mại chén Hoàng Diệu",
    "categoryId": "banh-mi"
  },
  "hnag-0371": {
    "expectedName": "Kem bơ sáp Đà Lạt",
    "categoryId": "trang-mieng"
  },
  "hnag-0372": {
    "expectedName": "Kem bơ sáp sầu riêng Đà Lạt",
    "categoryId": "trang-mieng"
  },
  "hnag-0380": {
    "expectedName": "Sữa đậu nành nóng ăn kèm bánh ngọt",
    "categoryId": "nuoc-khac",
    "enabled": false
  },
  "hnag-0381": {
    "expectedName": "Sữa đậu nành nóng ăn kèm bánh tiêu bánh bò",
    "categoryId": "nuoc-khac",
    "enabled": false
  },
  "hnag-0382": {
    "expectedName": "Sữa đậu nành nóng ăn kèm bánh tiêu croissant",
    "categoryId": "nuoc-khac",
    "enabled": false
  },
  "hnag-0386": {
    "expectedName": "Rượu cần Tây Nguyên",
    "categoryId": "co-con"
  },
  "hnag-0390": {
    "expectedName": "Rượu cần nếp cẩm Kon Tum",
    "categoryId": "co-con"
  },
  "hnag-0404": {
    "expectedName": "Bánh mì Huynh Hoa / Thịt nguội pa-tê đầy ắp",
    "categoryId": "banh-mi"
  },
  "hnag-0405": {
    "expectedName": "Bánh mì kẹp thịt Sài Gòn",
    "categoryId": "banh-mi"
  },
  "hnag-0406": {
    "expectedName": "Bánh mì pa-tê thịt chả lụa",
    "categoryId": "banh-mi"
  },
  "hnag-0407": {
    "expectedName": "Bánh mì thịt chả pa-tê Sài Gòn",
    "categoryId": "banh-mi"
  },
  "hnag-0408": {
    "expectedName": "Bánh mì thịt pa-tê chả lụa Sài Gòn",
    "categoryId": "banh-mi"
  },
  "hnag-0437": {
    "expectedName": "Bánh mì nướng muối ớt chà bông",
    "categoryId": "an-vat"
  },
  "hnag-0450": {
    "expectedName": "Chè bưởi An Giang giòn sần sật",
    "categoryId": "trang-mieng"
  },
  "hnag-0451": {
    "expectedName": "Chè mâm 16 món Sư Vạn Hạnh",
    "categoryId": "trang-mieng"
  },
  "hnag-0492": {
    "expectedName": "Lẩu nấm chay dưỡng sinh",
    "categoryId": "lau-nuong"
  },
  "hnag-0493": {
    "expectedName": "Lẩu nấm chay dưỡng sinh thanh đạm",
    "categoryId": "lau-nuong"
  },
  "hnag-0494": {
    "expectedName": "Lẩu nấm chay thanh đạm Sài Gòn",
    "categoryId": "lau-nuong"
  },
  "hnag-0495": {
    "expectedName": "Chè khúc bạch hạnh nhân lát",
    "categoryId": "trang-mieng"
  },
  "hnag-0496": {
    "expectedName": "Bạc xỉu ba tầng sữa đá Sài Gòn",
    "categoryId": "cafe"
  },
  "hnag-0500": {
    "expectedName": "Nước sâm bí đao la hán quả thảo mộc",
    "categoryId": "nuoc-khac"
  },
  "hnag-0501": {
    "expectedName": "Rau má đậu xanh sữa dừa",
    "categoryId": "nuoc-khac"
  },
  "hnag-0505": {
    "expectedName": "Trà tắc / Nước mía sầu riêng Sài Gòn",
    "categoryId": "nuoc-khac"
  },
  "hnag-0517": {
    "expectedName": "Mãng cầu Bà Đen dầm sữa chua",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0518": {
    "expectedName": "Mãng cầu Bà Đen dầm sữa chua đá",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0528": {
    "expectedName": "Rượu bưởi Tân Triều Đồng Nai",
    "categoryId": "co-con"
  },
  "hnag-0550": {
    "expectedName": "Nước mắm cá cơm Phú Quốc 43 độ đạm",
    "kind": "FOOD",
    "categoryId": "mon-man",
    "enabled": false
  },
  "hnag-0551": {
    "expectedName": "Rượu sim Phú Quốc",
    "categoryId": "co-con"
  },
  "hnag-0552": {
    "expectedName": "Rượu sim rừng Phú Quốc",
    "categoryId": "co-con"
  },
  "hnag-0553": {
    "expectedName": "Rượu sim rừng Phú Quốc men ngọt",
    "categoryId": "co-con"
  },
  "hnag-0554": {
    "expectedName": "Thốt nốt lạnh nước dừa dầm đá",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0555": {
    "expectedName": "Thốt nốt lạnh nước dừa dầm đá bào",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0556": {
    "expectedName": "Thốt nốt lạnh sữa dừa",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0601": {
    "expectedName": "Pizza hủ tiếu chiên giòn Sáu Hoài",
    "categoryId": "an-vat"
  },
  "hnag-0619": {
    "expectedName": "Rượu đế Gò Đen Long An",
    "categoryId": "co-con"
  },
  "hnag-0620": {
    "expectedName": "Rượu đế Gò Đen Long An nếp than",
    "categoryId": "co-con"
  },
  "hnag-0632": {
    "expectedName": "Củ hủ dừa xào tép rong",
    "categoryId": "mon-man"
  },
  "hnag-0669": {
    "expectedName": "Bò lúc lắc",
    "categoryId": "mon-man"
  },
  "hnag-0684": {
    "expectedName": "Sữa chua dẻo",
    "categoryId": "trang-mieng"
  },
  "hnag-0685": {
    "expectedName": "Sữa chua nếp cẩm",
    "categoryId": "trang-mieng"
  },
  "hnag-0687": {
    "expectedName": "Đậu hũ kho nấm rơm tiêu đen",
    "categoryId": "mon-man"
  },
  "hnag-0688": {
    "expectedName": "Bánh mì chay xá xíu nấm đông cô",
    "categoryId": "banh-mi"
  },
  "hnag-0692": {
    "expectedName": "Chả giò chay nhân khoai môn đậu xanh",
    "categoryId": "an-vat"
  },
  "hnag-0694": {
    "expectedName": "Gỏi ngó sen nấm tuyết chay",
    "categoryId": "mon-man"
  },
  "hnag-0696": {
    "expectedName": "Lẩu nấm hạt sen củ quả dưỡng sinh thanh tịnh",
    "categoryId": "lau-nuong"
  },
  "hnag-0697": {
    "expectedName": "Lẩu nấm hạt sen củ sen thanh lọc cơ thể",
    "categoryId": "lau-nuong"
  },
  "hnag-0698": {
    "expectedName": "Lẩu nấm hạt sen rau củ thanh lọc",
    "categoryId": "lau-nuong"
  },
  "hnag-0699": {
    "expectedName": "Lẩu nấm hạt sen rau củ thanh lọc cơ thể",
    "categoryId": "lau-nuong"
  },
  "hnag-0700": {
    "expectedName": "Lẩu nấm rau củ quả hạt sen",
    "categoryId": "lau-nuong"
  },
  "hnag-0702": {
    "expectedName": "Nấm đùi gà kho tiêu xanh nước dừa",
    "categoryId": "mon-man"
  },
  "hnag-0704": {
    "expectedName": "Sườn non chay chiên sả ớt giòn rụm",
    "categoryId": "mon-man"
  },
  "hnag-0705": {
    "expectedName": "Chè đậu đen",
    "categoryId": "trang-mieng"
  },
  "hnag-0706": {
    "expectedName": "Chè ba màu",
    "categoryId": "trang-mieng"
  },
  "hnag-0707": {
    "expectedName": "Chè Thái",
    "categoryId": "trang-mieng"
  },
  "hnag-0708": {
    "expectedName": "Chè trôi nước",
    "categoryId": "trang-mieng"
  },
  "hnag-0711": {
    "expectedName": "Chanh tuyết",
    "categoryId": "da-xay"
  },
  "hnag-0714": {
    "expectedName": "Rượu nếp",
    "categoryId": "co-con"
  },
  "hnag-0729": {
    "expectedName": "Rượu Sake / Bia Sapporo",
    "categoryId": "co-con"
  },
  "hnag-0736": {
    "expectedName": "Chè sâm bổ lượng nhãn nhục hạt sen bo bo",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0737": {
    "expectedName": "Chè sâm bổ lượng nhãn nhục hạt sen thốt nốt",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0738": {
    "expectedName": "Sâm bổ lượng / Chè hạnh nhân Chợ Lớn",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0739": {
    "expectedName": "Beefsteak thăn bò sốt nấm truffle",
    "categoryId": "fastfood"
  },
  "hnag-0740": {
    "expectedName": "Beefsteak thăn bò sốt tiêu đen khoai tây nghiền",
    "categoryId": "fastfood"
  },
  "hnag-0741": {
    "expectedName": "Beefsteak thăn bò sốt tiêu đen / Xốt kem nấm truffle",
    "categoryId": "fastfood"
  },
  "hnag-0742": {
    "expectedName": "Beefsteak thăn bò sốt tiêu đen / Xốt nấm truffle",
    "categoryId": "fastfood"
  },
  "hnag-0743": {
    "expectedName": "Bít tết bò (Beefsteak sốt tiêu đen / sốt nấm)",
    "categoryId": "fastfood"
  },
  "hnag-0744": {
    "expectedName": "Burger bò nướng phô mai Cheddar tan chảy",
    "categoryId": "fastfood"
  },
  "hnag-0745": {
    "expectedName": "Burger bò nướng phô mai Cheddar xông khói",
    "categoryId": "fastfood"
  },
  "hnag-0746": {
    "expectedName": "Burger bò phô mai (Cheeseburger)",
    "categoryId": "fastfood"
  },
  "hnag-0747": {
    "expectedName": "Burger bò phô mai xông khói khoai tây lắc Lotteria Mc Donald",
    "categoryId": "fastfood"
  },
  "hnag-0756": {
    "expectedName": "Dimsum tổng hợp (Há cảo, Xíu mại)",
    "categoryId": "an-vat"
  },
  "hnag-0777": {
    "expectedName": "Pizza hải sản sốt Pesto / Phô mai 4 loại kéo sợi",
    "categoryId": "fastfood"
  },
  "hnag-0778": {
    "expectedName": "Pizza phô mai kéo sợi hải sản xốt Pesto The Pizza Company",
    "categoryId": "fastfood"
  },
  "hnag-0779": {
    "expectedName": "Pizza phô mai kéo sợi Pepperoni",
    "categoryId": "fastfood"
  },
  "hnag-0780": {
    "expectedName": "Pizza phô mai kéo sợi / Pepperoni / Hải sản Pesto",
    "categoryId": "fastfood"
  },
  "hnag-0798": {
    "expectedName": "Kem xôi dừa Thái Lan ly dừa tươi",
    "categoryId": "trang-mieng",
    "kind": "FOOD"
  },
  "hnag-0802": {
    "expectedName": "Pizza (Phô mai, Hải sản, Pepperoni)",
    "categoryId": "fastfood"
  },
  "hnag-0815": {
    "expectedName": "Lẩu cay Tứ Xuyên / Lẩu Haidilao múa mì",
    "categoryId": "lau-nuong"
  },
  "hnag-0825": {
    "expectedName": "Bingsu (Đá bào tuyết)",
    "kind": "FOOD",
    "categoryId": "trang-mieng"
  },
  "hnag-0826": {
    "expectedName": "Cocktail (Mojito, Gin Tonic, Margarita)",
    "categoryId": "co-con"
  },
  "hnag-0827": {
    "expectedName": "Mojito chanh bạc hà / Gin Tonic mát lạnh",
    "categoryId": "co-con"
  },
  "hnag-0828": {
    "expectedName": "Mojito chanh bạc hà / Gin Tonic thảo mộc",
    "categoryId": "co-con"
  },
  "hnag-0829": {
    "expectedName": "Rượu Sake nóng / Rượu mơ Umeshu Nhật",
    "categoryId": "co-con"
  },
  "hnag-0830": {
    "expectedName": "Rượu Sake / Rượu mơ Umeshu Nhật",
    "categoryId": "co-con"
  },
  "hnag-0831": {
    "expectedName": "Rượu Soju các vị",
    "categoryId": "co-con"
  },
  "hnag-0832": {
    "expectedName": "Rượu Soju hoa quả / Rượu gạo Makgeolli",
    "categoryId": "co-con"
  },
  "hnag-0841": {
    "expectedName": "Thắng dền Hà Giang",
    "categoryId": "trang-mieng",
    "kind": "FOOD"
  },
  "hnag-0842": {
    "expectedName": "Rượu ngô men lá Hà Giang",
    "categoryId": "co-con"
  },
  "hnag-0851": {
    "expectedName": "Khâu nhục Bắc Kạn",
    "categoryId": "mon-man"
  },
  "hnag-0855": {
    "expectedName": "Măng vầu luộc chấm mẻ Bắc Kạn",
    "categoryId": "mon-man"
  },
  "hnag-0862": {
    "expectedName": "Măng ớt Lạng Sơn",
    "categoryId": "mon-man"
  },
  "hnag-0863": {
    "expectedName": "Rượu Mẫu Sơn",
    "categoryId": "co-con"
  },
  "hnag-0866": {
    "expectedName": "Mầm đá Sa Pa xào",
    "categoryId": "mon-man"
  },
  "hnag-0871": {
    "expectedName": "Rượu San Lùng",
    "categoryId": "co-con"
  },
  "hnag-0872": {
    "expectedName": "Rượu ngô Bắc Hà",
    "categoryId": "co-con"
  },
  "hnag-0875": {
    "expectedName": "Lạp xưởng Yên Bái",
    "categoryId": "mon-man"
  },
  "hnag-0876": {
    "expectedName": "Măng sặt Yên Bái",
    "categoryId": "mon-man"
  },
  "hnag-0880": {
    "expectedName": "Rượu táo mèo Yên Bái",
    "categoryId": "co-con"
  },
  "hnag-0881": {
    "expectedName": "Pa pỉnh tộp Sơn La",
    "categoryId": "lau-nuong"
  },
  "hnag-0882": {
    "expectedName": "Nậm pịa Sơn La",
    "categoryId": "chao-sup"
  },
  "hnag-0886": {
    "expectedName": "Rau cải mèo Mộc Châu xào",
    "categoryId": "mon-man"
  },
  "hnag-0888": {
    "expectedName": "Sữa tươi Mộc Châu",
    "categoryId": "nuoc-khac"
  },
  "hnag-0889": {
    "expectedName": "Rượu táo mèo Sơn La",
    "categoryId": "co-con"
  },
  "hnag-0890": {
    "expectedName": "Pa pỉnh tộp Điện Biên",
    "categoryId": "lau-nuong"
  },
  "hnag-0899": {
    "expectedName": "Lam nhọ Lai Châu",
    "categoryId": "mon-man"
  },
  "hnag-0907": {
    "expectedName": "Rượu ngô Na Hang",
    "categoryId": "co-con"
  },
  "hnag-0908": {
    "expectedName": "Cọ ỏm Phú Thọ",
    "categoryId": "an-vat"
  },
  "hnag-0909": {
    "expectedName": "Rau sắn muối chua Phú Thọ",
    "categoryId": "mon-man"
  },
  "hnag-0910": {
    "expectedName": "Xáo chuối Lâm Thao",
    "categoryId": "mon-man"
  },
  "hnag-0912": {
    "expectedName": "Chả cuốn lá bưởi Hòa Bình",
    "categoryId": "mon-man"
  },
  "hnag-0915": {
    "expectedName": "Măng chua nấu gà Hòa Bình",
    "categoryId": "chao-sup"
  },
  "hnag-0916": {
    "expectedName": "Rượu cần Hòa Bình",
    "categoryId": "co-con"
  },
  "hnag-0918": {
    "expectedName": "Nham trám Hà Châu",
    "categoryId": "mon-man"
  },
  "hnag-0929": {
    "expectedName": "Gà Tiên Yên hấp",
    "categoryId": "mon-man"
  },
  "hnag-0932": {
    "expectedName": "Rượu nếp ngâm Hoành Bồ",
    "categoryId": "co-con"
  },
  "hnag-0933": {
    "expectedName": "Giá bể xào Hải Phòng",
    "categoryId": "mon-man"
  },
  "hnag-0940": {
    "expectedName": "Chả rươi Tứ Kỳ",
    "categoryId": "mon-man"
  },
  "hnag-0942": {
    "expectedName": "Rươi kho niêu đất Tứ Kỳ",
    "categoryId": "mon-man"
  },
  "hnag-0947": {
    "expectedName": "Chả rươi Hà Nội",
    "categoryId": "mon-man"
  },
  "hnag-0951": {
    "expectedName": "Chả cốm Hà Nội",
    "categoryId": "mon-man"
  },
  "hnag-0953": {
    "expectedName": "Nước sấu Hà Nội",
    "categoryId": "nuoc-khac"
  },
  "hnag-0954": {
    "expectedName": "Ếch om Phượng Tường",
    "categoryId": "mon-man"
  },
  "hnag-0955": {
    "expectedName": "Gà Đông Tảo hầm thuốc bắc",
    "categoryId": "mon-man"
  },
  "hnag-0964": {
    "expectedName": "Nem chua Yên Mạc",
    "categoryId": "an-vat"
  },
  "hnag-0966": {
    "expectedName": "Dê tái chanh Ninh Bình",
    "categoryId": "mon-man"
  },
  "hnag-0967": {
    "expectedName": "Dê hấp tía tô Ninh Bình",
    "categoryId": "mon-man"
  },
  "hnag-0968": {
    "expectedName": "Rượu Kim Sơn",
    "categoryId": "co-con"
  },
  "hnag-0971": {
    "expectedName": "Chè lam Phủ Quảng",
    "categoryId": "trang-mieng"
  },
  "hnag-1004": {
    "expectedName": "Lòng sả Quảng Trị",
    "categoryId": "chao-sup"
  },
  "hnag-1005": {
    "expectedName": "Mít thấu Quảng Trị",
    "categoryId": "mon-man"
  },
  "hnag-1007": {
    "expectedName": "Thịt trâu lá trơng",
    "categoryId": "mon-man"
  },
  "hnag-1009": {
    "expectedName": "Rượu Kim Long Quảng Trị",
    "categoryId": "co-con"
  },
  "hnag-1013": {
    "expectedName": "Vả trộn Huế",
    "categoryId": "mon-man"
  },
  "hnag-1014": {
    "expectedName": "Ram ít Huế",
    "categoryId": "an-vat"
  },
  "hnag-1018": {
    "expectedName": "Chè bắp Cồn Hến",
    "categoryId": "trang-mieng"
  },
  "hnag-1019": {
    "expectedName": "Chè hạt sen Huế",
    "categoryId": "trang-mieng"
  },
  "hnag-1020": {
    "expectedName": "Chè bột lọc heo quay Huế",
    "categoryId": "trang-mieng"
  },
  "hnag-1024": {
    "expectedName": "Ram cuốn cải Đà Nẵng",
    "categoryId": "an-vat"
  },
  "hnag-1026": {
    "expectedName": "Mít trộn Đà Nẵng",
    "categoryId": "mon-man"
  },
  "hnag-1031": {
    "expectedName": "Hoành thánh Hội An",
    "categoryId": "mon-man"
  },
  "hnag-1038": {
    "expectedName": "Cao lầu chay Hội An",
    "categoryId": "pho-mi"
  },
  "hnag-1039": {
    "expectedName": "Ram bắp Quảng Ngãi",
    "categoryId": "an-vat"
  },
  "hnag-1052": {
    "expectedName": "Gié bò Tây Sơn",
    "categoryId": "chao-sup"
  },
  "hnag-1058": {
    "expectedName": "Rượu Bàu Đá",
    "categoryId": "co-con"
  },
  "hnag-1062": {
    "expectedName": "Chả dông Phú Yên",
    "categoryId": "an-vat"
  },
  "hnag-1086": {
    "expectedName": "Rượu nho Ninh Thuận",
    "categoryId": "co-con"
  },
  "hnag-1092": {
    "expectedName": "Chả lụi Hàm Tân",
    "categoryId": "an-vat"
  },
  "hnag-1100": {
    "expectedName": "Dế chiên Kon Tum",
    "categoryId": "an-vat"
  },
  "hnag-1102": {
    "expectedName": "Rượu ghè Kon Tum",
    "categoryId": "co-con"
  },
  "hnag-1112": {
    "expectedName": "Rượu cần Gia Lai",
    "categoryId": "co-con"
  },
  "hnag-1114": {
    "expectedName": "Bò nhúng me Buôn Ma Thuột",
    "categoryId": "lau-nuong"
  },
  "hnag-1120": {
    "expectedName": "Rượu cần Đắk Lắk",
    "categoryId": "co-con"
  },
  "hnag-1126": {
    "expectedName": "Rượu cần M’Nông",
    "categoryId": "co-con"
  },
  "hnag-1128": {
    "expectedName": "Bánh mì xíu mại Đà Lạt",
    "categoryId": "banh-mi"
  },
  "hnag-1133": {
    "expectedName": "Kem bơ Đà Lạt",
    "categoryId": "trang-mieng"
  },
  "hnag-1134": {
    "expectedName": "Sữa đậu nành nóng Đà Lạt",
    "categoryId": "nuoc-khac"
  },
  "hnag-1146": {
    "expectedName": "Lá nhíp xào Bình Phước",
    "categoryId": "mon-man"
  },
  "hnag-1149": {
    "expectedName": "Rượu cần S’tiêng",
    "categoryId": "co-con"
  },
  "hnag-1161": {
    "expectedName": "Phá lấu Sài Gòn",
    "categoryId": "an-vat"
  },
  "hnag-1162": {
    "expectedName": "Bò bía Sài Gòn",
    "categoryId": "an-vat"
  },
  "hnag-1164": {
    "expectedName": "Bột chiên Sài Gòn",
    "categoryId": "an-vat"
  },
  "hnag-1168": {
    "expectedName": "Sủi cảo Chợ Lớn",
    "categoryId": "an-vat"
  },
  "hnag-1169": {
    "expectedName": "Há cảo Chợ Lớn",
    "categoryId": "an-vat"
  },
  "hnag-1173": {
    "expectedName": "Chân gà sả tắc Sài Gòn",
    "categoryId": "an-vat"
  },
  "hnag-1175": {
    "expectedName": "Sâm bổ lượng Chợ Lớn",
    "categoryId": "trang-mieng",
    "kind": "FOOD"
  },
  "hnag-1176": {
    "expectedName": "Nước sâm Sài Gòn",
    "categoryId": "nuoc-khac"
  },
  "hnag-1180": {
    "expectedName": "Rượu Gò Đen",
    "categoryId": "co-con"
  },
  "hnag-1187": {
    "expectedName": "Tép rang dừa Bến Tre",
    "categoryId": "mon-man"
  },
  "hnag-1190": {
    "expectedName": "Chuối đập Bến Tre",
    "categoryId": "trang-mieng",
    "kind": "FOOD"
  },
  "hnag-1192": {
    "expectedName": "Bông bí chiên giòn Bến Tre",
    "categoryId": "an-vat"
  },
  "hnag-1194": {
    "expectedName": "Rượu Phú Lễ",
    "categoryId": "co-con"
  },
  "hnag-1203": {
    "expectedName": "Khoai lang chấm mắm sống Vĩnh Long",
    "categoryId": "mon-man"
  },
  "hnag-1204": {
    "expectedName": "Nem Lai Vung",
    "categoryId": "an-vat"
  },
  "hnag-1210": {
    "expectedName": "Tung lò mò Châu Đốc",
    "categoryId": "mon-man"
  },
  "hnag-1218": {
    "expectedName": "Nước thốt nốt An Giang",
    "categoryId": "nuoc-khac"
  },
  "hnag-1219": {
    "expectedName": "Rượu thốt nốt An Giang",
    "categoryId": "co-con"
  },
  "hnag-1226": {
    "expectedName": "Vịt nấu chao Cần Thơ",
    "categoryId": "lau-nuong"
  },
  "hnag-1228": {
    "expectedName": "Pizza hủ tiếu Cần Thơ",
    "categoryId": "an-vat"
  },
  "hnag-1233": {
    "expectedName": "Sỏi mầm Hậu Giang",
    "categoryId": "mon-man"
  },
  "hnag-1249": {
    "expectedName": "Bồn bồn xào vọp",
    "categoryId": "mon-man"
  },
  "hnag-1255": {
    "expectedName": "Đọt choại luộc chấm mắm",
    "categoryId": "mon-man"
  },
  "hnag-1256": {
    "expectedName": "Đọt choại xào tỏi",
    "categoryId": "mon-man"
  },
  "hnag-1268": {
    "expectedName": "Nước vối",
    "categoryId": "nuoc-khac"
  },
  "hnag-1269": {
    "expectedName": "Nước mơ ngâm Hà Nội",
    "categoryId": "nuoc-khac"
  },
  "hnag-1271": {
    "expectedName": "Rượu làng Vân",
    "categoryId": "co-con"
  },
  "hnag-1272": {
    "expectedName": "Rượu men lá Bằng Phúc",
    "categoryId": "co-con"
  },
  "hnag-1273": {
    "expectedName": "Rượu ngô Bản Phố",
    "categoryId": "co-con"
  },
  "hnag-1274": {
    "expectedName": "Rượu sim Phú Quốc",
    "categoryId": "co-con"
  },
  "hnag-1275": {
    "expectedName": "Rượu dừa Bến Tre",
    "categoryId": "co-con"
  },
  "hnag-1276": {
    "expectedName": "Rượu Xuân Thạnh Trà Vinh",
    "categoryId": "co-con"
  },
  "hnag-1284": {
    "expectedName": "Bánh mì chay",
    "categoryId": "banh-mi"
  },
  "hnag-1288": {
    "expectedName": "Chả giò chay",
    "categoryId": "an-vat"
  },
  "hnag-1289": {
    "expectedName": "Bò kho chay",
    "categoryId": "mon-man"
  },
  "hnag-1290": {
    "expectedName": "Cà ri chay",
    "categoryId": "mon-man"
  },
  "hnag-1293": {
    "expectedName": "Đậu hũ sả ớt",
    "categoryId": "mon-man"
  },
  "hnag-1294": {
    "expectedName": "Đậu hũ kho nấm",
    "categoryId": "mon-man"
  },
  "hnag-1295": {
    "expectedName": "Nấm kho tiêu",
    "categoryId": "mon-man"
  },
  "hnag-1300": {
    "expectedName": "Rau má đậu xanh",
    "categoryId": "nuoc-khac"
  },
  "hnag-1301": {
    "expectedName": "Sữa bắp",
    "categoryId": "nuoc-khac"
  },
  "hnag-1302": {
    "expectedName": "Chanh muối",
    "categoryId": "nuoc-khac"
  },
  "hnag-1303": {
    "expectedName": "Tắc xí muội",
    "categoryId": "nuoc-khac"
  },
  "hnag-1304": {
    "expectedName": "Sâm bí đao",
    "categoryId": "nuoc-khac"
  },
  "hnag-1311": {
    "expectedName": "Măng rừng luộc chấm chẩm chéo Điện Biên",
    "categoryId": "mon-man"
  },
  "hnag-1312": {
    "expectedName": "Mèn mén Hà Giang",
    "categoryId": "mon-man"
  },
  "hnag-1323": {
    "expectedName": "Măng lay luộc chấm chẩm chéo Sơn La",
    "categoryId": "mon-man"
  },
  "hnag-1324": {
    "expectedName": "Rau dớn xào tỏi Tây Bắc",
    "categoryId": "mon-man"
  },
  "hnag-1325": {
    "expectedName": "Rau bò khai xào tỏi Cao Bằng",
    "categoryId": "mon-man"
  },
  "hnag-1327": {
    "expectedName": "Măng đắng Lai Châu chấm chẩm chéo",
    "categoryId": "mon-man"
  },
  "hnag-1332": {
    "expectedName": "Rau đồ người Mường Hòa Bình",
    "categoryId": "mon-man"
  },
  "hnag-1333": {
    "expectedName": "Thịt lợn muối chua người Mường Hòa Bình",
    "categoryId": "mon-man"
  },
  "hnag-1349": {
    "expectedName": "Lươn om chuối đậu Nghệ An",
    "categoryId": "mon-man"
  },
  "hnag-1353": {
    "expectedName": "Tam hữu Hội An",
    "categoryId": "mon-man"
  },
  "hnag-1356": {
    "expectedName": "Cá cơm rim Lý Sơn",
    "categoryId": "mon-man"
  },
  "hnag-1365": {
    "expectedName": "Cà dĩa chiên Chăm Ninh Thuận",
    "categoryId": "mon-man"
  },
  "hnag-1367": {
    "expectedName": "Canh bầu cá cơm Chăm Ninh Thuận",
    "categoryId": "chao-sup"
  },
  "hnag-1369": {
    "expectedName": "Nước mủ trôm Ninh Thuận",
    "categoryId": "nuoc-khac"
  },
  "hnag-1370": {
    "expectedName": "Nước nho Ninh Thuận",
    "categoryId": "ep-sinh-to"
  },
  "hnag-1371": {
    "expectedName": "Cà đắng giã ớt Ê Đê",
    "categoryId": "mon-man"
  },
  "hnag-1372": {
    "expectedName": "Đọt mây nướng Ê Đê",
    "categoryId": "lau-nuong"
  },
  "hnag-1374": {
    "expectedName": "Rượu cần Ê Đê",
    "categoryId": "co-con"
  },
  "hnag-1379": {
    "expectedName": "Măng le xào lòng gà M'Nông",
    "categoryId": "mon-man"
  },
  "hnag-1381": {
    "expectedName": "Lá bép xào tỏi M'Nông",
    "categoryId": "mon-man"
  },
  "hnag-1386": {
    "expectedName": "Bánh mì xíu mại Sài Gòn",
    "categoryId": "banh-mi"
  },
  "hnag-1387": {
    "expectedName": "Bánh mì bì Sài Gòn",
    "categoryId": "banh-mi"
  },
  "hnag-1388": {
    "expectedName": "Bánh mì chả cá Sài Gòn",
    "categoryId": "banh-mi"
  },
  "hnag-1389": {
    "expectedName": "Bánh mì heo quay Chợ Lớn",
    "categoryId": "banh-mi"
  },
  "hnag-1390": {
    "expectedName": "Chè mè đen Chợ Lớn",
    "categoryId": "trang-mieng"
  },
  "hnag-1391": {
    "expectedName": "Chè hột gà trà Chợ Lớn",
    "categoryId": "trang-mieng"
  },
  "hnag-1392": {
    "expectedName": "Chè đậu đỏ Chợ Lớn",
    "categoryId": "trang-mieng"
  },
  "hnag-1398": {
    "expectedName": "Lươn um rau ngổ miền Tây",
    "categoryId": "mon-man"
  },
  "hnag-1409": {
    "expectedName": "Gà hấp muối người Hẹ Chợ Lớn",
    "categoryId": "mon-man"
  },
  "hnag-1410": {
    "expectedName": "Khoai môn khâu nhục người Hẹ",
    "categoryId": "mon-man"
  },
  "hnag-1411": {
    "expectedName": "Tàu hũ Đông Giang người Hẹ",
    "categoryId": "mon-man"
  },
  "hnag-1417": {
    "expectedName": "Dìn chấy xào chao đỏ",
    "categoryId": "mon-man"
  },
  "hnag-1420": {
    "expectedName": "Giò heo phá lấu Chợ Lớn",
    "categoryId": "mon-man"
  },
  "hnag-1421": {
    "expectedName": "Khoai môn hấp heo quay",
    "categoryId": "mon-man"
  },
  "hnag-1422": {
    "expectedName": "Bao tử heo xào cải chua người Hoa",
    "categoryId": "mon-man"
  },
  "hnag-1423": {
    "expectedName": "Dồi trường xào hành gừng",
    "categoryId": "mon-man"
  },
  "hnag-1424": {
    "expectedName": "Dồi trường xào bông hẹ",
    "categoryId": "mon-man"
  },
  "hnag-1425": {
    "expectedName": "Bò xào tàu xì",
    "categoryId": "mon-man"
  },
  "hnag-1426": {
    "expectedName": "Trứng ba màu người Hoa",
    "categoryId": "mon-man"
  },
  "hnag-1427": {
    "expectedName": "Hột vịt muối chưng thịt",
    "categoryId": "mon-man"
  },
  "hnag-1432": {
    "expectedName": "Bắp heo tiềm thuốc Bắc",
    "categoryId": "chao-sup"
  },
  "hnag-1433": {
    "expectedName": "Gà ác tiềm thuốc Bắc Chợ Lớn",
    "categoryId": "chao-sup"
  },
  "hnag-1434": {
    "expectedName": "Óc heo tiềm thuốc Bắc",
    "categoryId": "chao-sup"
  },
  "hnag-1435": {
    "expectedName": "Tim heo tiềm thuốc Bắc",
    "categoryId": "chao-sup"
  },
  "hnag-1436": {
    "expectedName": "Cật heo tiềm thuốc Bắc",
    "categoryId": "chao-sup"
  },
  "hnag-1440": {
    "expectedName": "Chả giò Triều Châu",
    "categoryId": "an-vat"
  },
  "hnag-1441": {
    "expectedName": "Đậu hũ nhồi thịt người Hẹ",
    "categoryId": "mon-man"
  },
  "hnag-1468": {
    "expectedName": "Chè hột gà củ năng Chợ Lớn",
    "categoryId": "trang-mieng"
  },
  "hnag-1469": {
    "expectedName": "Chè bạch quả Chợ Lớn",
    "categoryId": "trang-mieng"
  },
  "hnag-1470": {
    "expectedName": "Chè bo bo trứng cút",
    "categoryId": "trang-mieng"
  },
  "hnag-1471": {
    "expectedName": "Chè đậu hũ hạnh nhân",
    "categoryId": "trang-mieng"
  },
  "hnag-1472": {
    "expectedName": "Chè trái dâu người Hoa",
    "categoryId": "trang-mieng"
  },
  "hnag-1476": {
    "expectedName": "Chè bo bo đậu hũ",
    "categoryId": "trang-mieng"
  },
  "hnag-1477": {
    "expectedName": "Chè củ năng trứng cút",
    "categoryId": "trang-mieng"
  },
  "hnag-1478": {
    "expectedName": "Chè tuyết nhĩ táo đỏ",
    "categoryId": "trang-mieng"
  },
  "hnag-1479": {
    "expectedName": "Chè hạt sen bạch quả",
    "categoryId": "trang-mieng"
  },
  "hnag-1480": {
    "expectedName": "Chè nhãn nhục táo đỏ",
    "categoryId": "trang-mieng"
  },
  "hnag-1481": {
    "expectedName": "Chè khoai môn người Hoa",
    "categoryId": "trang-mieng"
  },
  "hnag-1482": {
    "expectedName": "Chè đậu đỏ vỏ quýt",
    "categoryId": "trang-mieng"
  },
  "hnag-1483": {
    "expectedName": "Chè đậu xanh vỏ quýt",
    "categoryId": "trang-mieng"
  },
  "hnag-1485": {
    "expectedName": "Chè tuyết giáp đu đủ tiềm",
    "categoryId": "trang-mieng"
  },
  "hnag-1486": {
    "expectedName": "Chè củ sen táo đỏ",
    "categoryId": "trang-mieng"
  },
  "hnag-1494": {
    "expectedName": "Lẩu cháo hải sản Quảng Đông",
    "categoryId": "lau-nuong"
  },
  "hnag-1501": {
    "expectedName": "Nước La Hán Quả",
    "categoryId": "nuoc-khac"
  },
  "hnag-1502": {
    "expectedName": "Nước củ năng mía lau",
    "categoryId": "nuoc-khac"
  },
  "hnag-1509": {
    "expectedName": "Xà lách xào kiểu Hoa Chợ Lớn",
    "categoryId": "mon-man"
  },
  "hnag-1510": {
    "expectedName": "Thịt kho rục kiểu Hoa Chợ Lớn",
    "categoryId": "mon-man"
  },
  "hnag-1531": {
    "expectedName": "Đậu hũ Mapo thịt bằm",
    "categoryId": "mon-man"
  },
  "hnag-1533": {
    "expectedName": "Bò hoa tuyết kiểu Đông Pha",
    "categoryId": "mon-man"
  },
  "hnag-1536": {
    "expectedName": "Giò heo hầm xốt xí muội",
    "categoryId": "mon-man"
  },
  "hnag-1539": {
    "expectedName": "Nấm lộc nhung xào thịt xốt XO",
    "categoryId": "mon-man"
  },
  "hnag-1557": {
    "expectedName": "Bò xào tiêu đen Hong Kong",
    "categoryId": "mon-man"
  },
  "hnag-1558": {
    "expectedName": "Bò xào cải làn dầu hào",
    "categoryId": "mon-man"
  },
  "hnag-1559": {
    "expectedName": "Cải làn xào dầu hào",
    "categoryId": "mon-man"
  },
  "hnag-1561": {
    "expectedName": "Cà tím cá mặn tay cầm",
    "categoryId": "mon-man"
  },
  "hnag-1586": {
    "expectedName": "Bò thủy chử Tứ Xuyên",
    "categoryId": "mon-man"
  },
  "hnag-1590": {
    "expectedName": "Thịt heo hai lần chín (Hui Guo Rou)",
    "categoryId": "mon-man"
  },
  "hnag-1591": {
    "expectedName": "Cà tím cá hương Tứ Xuyên",
    "categoryId": "mon-man"
  },
  "hnag-1592": {
    "expectedName": "Thịt heo xào cá hương",
    "categoryId": "mon-man"
  },
  "hnag-1593": {
    "expectedName": "Gà Kung Pao",
    "categoryId": "mon-man"
  },
  "hnag-1594": {
    "expectedName": "Đậu que xào khô Tứ Xuyên",
    "categoryId": "mon-man"
  },
  "hnag-1595": {
    "expectedName": "Khoai tây sợi chua cay",
    "categoryId": "mon-man"
  },
  "hnag-1625": {
    "expectedName": "Ootoro Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1626": {
    "expectedName": "Chutoro Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1627": {
    "expectedName": "Uni Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1628": {
    "expectedName": "Hotate Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1629": {
    "expectedName": "Hamachi Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1630": {
    "expectedName": "Tai Usuzukuri Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1631": {
    "expectedName": "Shime Saba Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1632": {
    "expectedName": "Amaebi Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1633": {
    "expectedName": "Ikura Oroshi",
    "categoryId": "mon-man"
  },
  "hnag-1635": {
    "expectedName": "Hokkigai Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1636": {
    "expectedName": "Kanpachi Sashimi",
    "categoryId": "mon-man"
  },
  "hnag-1641": {
    "expectedName": "Cuộn rong biển Dookki",
    "categoryId": "an-vat"
  },
  "hnag-1646": {
    "expectedName": "Ramyeon Dookki",
    "categoryId": "pho-mi"
  },
  "hnag-1648": {
    "expectedName": "Topokki phô mai Dookki",
    "categoryId": "an-vat"
  },
  "hnag-1663": {
    "expectedName": "Kem dừa hạt lựu kiểu Thái",
    "categoryId": "trang-mieng"
  },
  "hnag-1664": {
    "expectedName": "Chè Lod Chong",
    "categoryId": "trang-mieng"
  },
  "hnag-1671": {
    "expectedName": "Palak Paneer",
    "categoryId": "mon-man"
  },
  "hnag-1672": {
    "expectedName": "Aloo Gobi",
    "categoryId": "mon-man"
  },
  "hnag-1673": {
    "expectedName": "Dal Tadka",
    "categoryId": "mon-man"
  },
  "hnag-1674": {
    "expectedName": "Chana Masala",
    "categoryId": "mon-man"
  },
  "hnag-1675": {
    "expectedName": "Lamb Rogan Josh",
    "categoryId": "mon-man"
  },
  "hnag-1676": {
    "expectedName": "Goan Fish Curry",
    "categoryId": "mon-man"
  }
};

export function correctClassification(item: CandidateItem): CandidateItem {
  const correction = CLASSIFICATION_CORRECTIONS[item.id];
  if (!correction || correction.expectedName !== item.name) return item;
  return { ...item, kind: correction.kind ?? item.kind, categoryId: correction.categoryId ?? item.categoryId,
    enabled: correction.enabled ?? item.enabled };
}
