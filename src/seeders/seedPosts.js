const { Post } = require("../models");
const { sequelize } = require("../config/connectDB");

const seedPosts = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established.");

    // Xóa dữ liệu cũ để tránh trùng lặp
    await Post.destroy({ where: {}, truncate: true });
    console.log("🗑 Cleared old posts.");

    const posts = [
      {
        tieu_de:
          "Review sách: Nhà Giả Kim - Hành trình tìm kiếm kho báu của chính mình",
        tom_tat:
          "Nhà Giả Kim của Paulo Coelho không chỉ là một cuốn tiểu thuyết, mà là một kim chỉ nam cho những ai đang lạc lối trên con đường theo đuổi ước mơ. Câu chuyện về chàng chăn cừu Santiago đã làm rung động hàng triệu trái tim.",
        noi_dung: `
                    <p><strong>"Khi bạn khao khát một điều gì đó, cả vũ trụ sẽ hợp lực giúp bạn đạt được điều đó."</strong></p>
                    <p>Đó là câu nói nổi tiếng nhất trong <em>Nhà Giả Kim (The Alchemist)</em>, và cũng là tinh thần xuyên suốt tác phẩm của Paulo Coelho. Cuốn sách kể về hành trình của Santiago, một chàng chăn cừu trẻ tuổi ở Tây Ban Nha, người đã dám từ bỏ cuộc sống an phận để đi tìm kho báu ở Kim Tự Tháp Ai Cập theo lời mách bảo của một giấc mơ.</p>
                    <p>Trên hành trình đó, Santiago đã gặp gỡ nhiều người: một bà già xem bói, một ông vua già, một người bán kem, một nhà giả kim... Mỗi người đều mang đến cho cậu những bài học quý giá về "Vận Mệnh Cá Nhân". Cậu học được cách lắng nghe trái tim mình, học cách đọc những dấu hiệu của vũ trụ, và quan trọng hơn cả, học cách không từ bỏ khi đối mặt với thử thách.</p>
                    <p>Nhà Giả Kim không có cốt truyện phức tạp hay những tình tiết giật gân. Sức hút của nó nằm ở sự giản dị và triết lý sâu sắc được lồng ghép nhẹ nhàng. Cuốn sách nhắc nhở chúng ta rằng, kho báu thực sự đôi khi không nằm ở đích đến, mà nằm ngay trên hành trình chúng ta đi và những con người chúng ta trở thành sau hành trình đó.</p>
                    <p>Nếu bạn đang cảm thấy chông chênh, mất phương hướng hay sợ hãi khi phải bước ra khỏi vùng an toàn, hãy đọc <em>Nhà Giả Kim</em>. Nó sẽ tiếp thêm cho bạn dũng khí để theo đuổi ước mơ của riêng mình.</p>
                `,
        hinh_anh: "/images/blog/nha-gia-kim.jpg",
        trang_thai: true,
        user_id: 1,
      },
      {
        tieu_de: "Hoàng Tử Bé - Khi người lớn từng là trẻ con",
        tom_tat:
          "Một câu chuyện ngụ ngôn đầy chất thơ về cuộc sống, tình yêu và tình bạn. Hoàng Tử Bé nhắc nhở chúng ta về những điều giản dị nhưng quan trọng mà người lớn thường hay lãng quên.",
        noi_dung: `
                    <p><em>Hoàng Tử Bé (Le Petit Prince)</em> của Antoine de Saint-Exupéry là một cuốn sách kỳ lạ. Nó được viết cho trẻ em, nhưng lại khiến người lớn phải suy ngẫm và rơi nước mắt. Câu chuyện bắt đầu khi một phi công gặp nạn ở sa mạc Sahara và tình cờ gặp gỡ một cậu bé đến từ tiểu tinh cầu B612 - Hoàng Tử Bé.</p>
                    <p>Hoàng Tử Bé kể cho người phi công nghe về hành trình du hành qua các hành tinh khác nhau, gặp gỡ những "người lớn" kỳ quặc: một ông vua thích ra lệnh, một gã khoác lác, một nhà buôn... Qua đôi mắt trong veo của Hoàng Tử Bé, thế giới của người lớn hiện lên thật nực cười, đầy những toan tính, bận rộn vô nghĩa và thiếu vắng tình yêu thương.</p>
                    <p><strong>"Người ta chỉ nhìn thấy thật rõ ràng bằng trái tim. Cái cốt lõi thì mắt thường không nhìn thấy được."</strong> - Đây là bí mật mà Cáo đã tặng cho Hoàng Tử Bé. Đó là bài học về tình yêu và trách nhiệm. Bông hồng của Hoàng Tử Bé là duy nhất, không phải vì nó đẹp nhất, mà vì cậu đã dành thời gian và tình yêu để chăm sóc nó.</p>
                    <p>Hoàng Tử Bé là một lời nhắc nhở nhẹ nhàng về việc giữ gìn sự ngây thơ, trí tưởng tượng và sự tử tế trong tâm hồn. Đọc cuốn sách này để thấy mình cần sống chậm lại, yêu thương nhiều hơn và trân trọng những điều giản dị xung quanh.</p>
                `,
        hinh_anh: "/images/blog/hoang-tu-be.jpg",
        trang_thai: true,
        user_id: 1,
      },
      {
        tieu_de: "Bố Già - Bản hùng ca của thế giới ngầm",
        tom_tat:
          "Hơn cả một tiểu thuyết tội phạm, Bố Già là câu chuyện về gia đình, quyền lực và danh dự. Mario Puzo đã khắc họa một Don Vito Corleone đầy khí chất, lạnh lùng nhưng cũng rất đỗi con người.",
        noi_dung: `
                    <p><em>Bố Già (The Godfather)</em> đưa người đọc bước vào thế giới của gia đình Mafia gốc Ý Corleone tại Mỹ. Trung tâm của câu chuyện là "Bố Già" Don Vito Corleone, một ông trùm đầy quyền lực, nguyên tắc và được kính nể. Ông không chỉ là một kẻ tội phạm, mà là một người đàn ông của gia đình, một người bảo trợ cho những kẻ yếu thế (theo cách riêng của mình).</p>
                    <p>Mario Puzo đã xây dựng một cốt truyện chặt chẽ, kịch tính với những màn đấu trí, trả thù đẫm máu giữa các băng đảng. Nhưng vượt lên trên bạo lực là những giá trị về lòng trung thành, tình phụ tử và trách nhiệm. Câu nói: <strong>"Người đàn ông không dành thời gian cho gia đình thì không bao giờ có thể trở thành người đàn ông chân chính"</strong> đã trở thành tuyên ngôn sống của nhân vật.</p>
                    <p>Sự chuyển biến tâm lý của Michael Corleone - con trai út của Don Vito - từ một thanh niên muốn tránh xa thế giới tôi phạm trở thành một "Bố Già" tàn nhẫn và quyết đoán hơn cả cha mình, là điểm nhấn xuất sắc của tác phẩm. Cuốn sách cho thấy sức hút của quyền lực và cái giá phải trả khi bước chân vào con đường không thể quay đầu.</p>
                    <p>Bố Già không cổ xúy cho tội ác, nhưng nó phơi bày một góc khuất của xã hội với những luật lệ riêng khắc nghiệt. Một tác phẩm kinh điển không thể bỏ qua cho những ai yêu thích văn học kịch tính và có chiều sâu.</p>
                `,
        hinh_anh: "/images/blog/bo-gia.jpg",
        trang_thai: true,
        user_id: 1,
      },
      {
        tieu_de: "Đắc Nhân Tâm - Nghệ thuật thu phục lòng người",
        tom_tat:
          "Không phải ngẫu nhiên mà Đắc Nhân Tâm luôn nằm trong top sách bán chạy nhất mọi thời đại. Những nguyên tắc ứng xử của Dale Carnegie vẫn còn nguyên giá trị cốt lõi trong xã hội hiện đại.",
        noi_dung: `
                    <p>Được xuất bản lần đầu năm 1936, <em>Đắc Nhân Tâm (How to Win Friends and Influence People)</em> của Dale Carnegie được xem là cuốn sách "gối đầu giường" của nhiều thế hệ về nghệ thuật giao tiếp và ứng xử.</p>
                    <p>Cuốn sách không dạy những mánh khoé để thao túng người khác, mà dạy cách thấu hiểu, lắng nghe và tôn trọng chân thành. Từ những nguyên tắc đơn giản như: "Không chỉ trích, oán trách hay than phiền", "Thành thật khen ngợi và biết ơn người khác", "Luôn nhớ tên người đối diện"... Dale Carnegie đã đúc kết thành những bài học sâu sắc giúp xây dựng các mối quan hệ tốt đẹp.</p>
                    <p>Nhiều người cho rằng Đắc Nhân Tâm là giả tạo, là "sống khéo". Nhưng nếu đọc kỹ và áp dụng bằng sự chân thành, bạn sẽ thấy nó giúp giảm bớt những xung đột không đáng có, khiến mọi người yêu mến và tin tưởng bạn hơn. Trong một thế giới công nghệ khô khan, sự kết nối giữa người với người dựa trên sự thấu cảm càng trở nên quan trọng hơn bao giờ hết.</p>
                    <p>Đắc Nhân Tâm là cuốn sách dành cho bất kỳ ai muốn hoàn thiện bản thân, cải thiện kỹ năng giao tiếp và đạt được thành công trong cuộc sống cũng như sự nghiệp.</p>
                `,
        hinh_anh: "/images/blog/dac-nhan-tam.jpg",
        trang_thai: true,
        user_id: 1,
      },
      {
        tieu_de: "Hai Số Phận - Cuộc đối đầu định mệnh",
        tom_tat:
          "Kane và Abel, hai con người sinh cùng ngày, cùng giờ nhưng ở hai thế giới hoàn toàn đối lập. Câu chuyện về tham vọng, hận thù và sự tha thứ trải dài suốt cuộc đời họ.",
        noi_dung: `
                    <p><em>Hai Số Phận (Kane and Abel)</em> của Jeffrey Archer là một kiệt tác về thể loại tiểu thuyết saga. Câu chuyện kể về hai người đàn ông sinh ra cùng ngày 18/04/1906: William Lowell Kane - con trai một gia đình ngân hàng giàu có tại Mỹ, và Abel Rosnovski - một đứa trẻ mồ côi gốc Ba Lan sinh ra trong rừng rậm.</p>
                    <p>Số phận đưa đẩy họ trở thành những người đàn ông quyền lực và giàu có, nhưng cũng biến họ thành kẻ thù không đội trời chung chỉ vì những hiểu lầm. Cuộc đối đầu giữa Kane và Abel kéo dài suốt hàng thập kỷ, ảnh hưởng đến cả thế hệ con cháu của họ. Tác giả đã khéo léo lồng ghép lịch sử thế giới thế kỷ 20 vào cuộc đời của hai nhân vật, từ Thế chiến, Đại suy thoái đến sự phát triển của phố Wall.</p>
                    <p>Cuốn sách lôi cuốn người đọc bởi mạch truyện nhanh, kịch tính và những ngã rẽ bất ngờ. Nó là bài học về ý chí vươn lên tột cùng của con người, về cái giá của sự hận thù và vẻ đẹp muộn màng của sự tha thứ. Khi gấp sách lại, người đọc không khỏi bùi ngùi tiếc nuối cho một tình bạn lẽ ra đã có thể rất đẹp nếu không có sự trớ trêu của định mệnh.</p>
                `,
        hinh_anh: "/images/blog/hai-so-phan.jpg",
        trang_thai: true,
        user_id: 1,
      },
      {
        tieu_de: "Mắt Biếc - Nỗi buồn trong veo của tuổi trẻ",
        tom_tat:
          "Chuyện tình đơn phương của Ngạn dành cho Hà Lan - cô gái có đôi mắt biếc. Một tác phẩm lãng mạn và buồn man mác, gắn liền với ký ức tuổi thơ và những rung động đầu đời.",
        noi_dung: `
                    <p>Nhắc đến Nguyễn Nhật Ánh, người ta thường nghĩ đến những câu chuyện thiếu nhi vui tươi. Nhưng <em>Mắt Biếc</em> lại là một nốt trầm buồn đến nao lòng. Câu chuyện xoay quanh Ngạn và Hà Lan, đôi bạn thanh mai trúc mã lớn lên từ làng Đo Đo. Ngạn yêu Hà Lan với một tình yêu thuần khiết, thầm lặng và bền bỉ suốt cả cuộc đời.</p>
                    <p>Nhưng Hà Lan không giống Ngạn. Cô yêu phố thị phồn hoa, yêu những thứ lấp lánh và cuối cùng vấp ngã. Ngạn vẫn ở đó, bao dung và che chở, thậm chí chăm sóc cho Trà Long - con gái của Hà Lan. Tình yêu của Ngạn không chỉ là tình nam nữ, mà còn là sự hoài niệm về quê hương, về những giá trị cũ kỹ đang dần mai một.</p>
                    <p>Cái kết của Mắt Biếc để lại nhiều day dứt. Sự ra đi của Ngạn là một sự giải thoát, hay là một sự chạy trốn? Có lẽ là cả hai. Đọc Mắt Biếc, ai cũng thấy một phần tuổi trẻ của mình trong đó: những rung động đầu đời, những nuối tiếc và cả những sự lựa chọn sai lầm.</p>
                    <p>Và trên hết, Mắt Biếc là một bức tranh tuyệt đẹp về tình yêu cao thượng, sự hy sinh mà không cần đền đáp.</p>
                `,
        hinh_anh: "/images/blog/mat-biec.jpg",
        trang_thai: true,
        user_id: 1,
      },
    ];

    for (const post of posts) {
      await Post.create(post);
    }

    console.log("✅ Seeded 6 blog posts with NEW content successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    process.exit();
  }
};

seedPosts();
