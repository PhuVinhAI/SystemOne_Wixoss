# Ca nghiệm thu luật chơi

Các ca dùng trạng thái giả định để kiểm tra engine. Mặc định các lá không có hiệu ứng ngoài những gì ghi trong ca. Nguồn luật cho từng nhóm nằm trong [deck và setup](01-match-and-decks.md), [vòng lượt](03-turn-and-resources.md), [chiến đấu](04-combat.md) và [hiệu ứng](05-cards-and-effects.md).

| Ca | Đầu vào và hành động | Kết quả mong đợi |
| --- | --- | --- |
| Deck hợp lệ | 40 lá, 20 Life Burst, bốn bản cùng một tên từ các bản in khác nhau. Lá khác màu ba LRIG mở trận. | Hợp lệ nếu các điều kiện còn lại thỏa. Thêm bản thứ năm cùng tên hoặc tăng số Life Burst lên 21 làm Main Deck không hợp lệ. |
| LRIG Deck | 10 non-PIECE và hai PIECE, ba LRIG Level 0 đúng vai trò. | Hợp lệ nếu không trùng tên và cả hai PIECE không cùng thuộc nhóm giới hạn Team/Dream Team. |
| Mulligan | Người đi trước đổi hai lá. Người đi sau đổi không lá. | Hai bên vẫn có năm lá trên hand sau mulligan, bảy Life Cloth sau setup và 28 lá trong Main Deck. |
| Lượt đầu | A đi trước. A và B lần lượt đến Draw và Attack trong lượt đầu mỗi bên. | A rút một, bỏ Attack. B rút hai và thực hiện Attack Phase bình thường. |
| Ener và Retire | Chọn một SIGNI trên field trong Ener Phase. Trong Main Phase, Retire đồng thời hai SIGNI khác. | SIGNI đầu đến Ener. Hai SIGNI Retire đi Trash. Hết quyền Retire trong lượt. |
| Grow và Limit | Center Level 2, Limit 5. Có hai SIGNI Level 2, một slot trống. | SIGNI Level 2 thứ ba bị từ chối. Khi Assist cộng +1 Limit thì đặt được. SIGNI Level 3 vẫn bị từ chối. |
| Draw cạn deck | Trong lượt phải rút hai, Main Deck có một lá và Trash có bài. | Rút một, Refresh, chuyển một Life Cloth còn có vào Trash và sang Ener. Bài từ deck mới không được rút bù. |
| Refresh sau Spell | Spell làm cạn Main Deck khi đang xử lý. | Giải quyết phần có thể thực hiện, đặt Spell vào Trash, sau đó Refresh từ Trash. |
| Refresh khi Trash trống | Main Deck và Trash đều trống. Sau đó có lá vào Trash tại điểm kiểm tra. | Refresh được trì hoãn đến khi Trash có bài. Refresh lần hai của Turn Player trong chính lượt mình kết thúc lượt. |
| So Power | SIGNI tấn công với Power bằng SIGNI đối diện. | SIGNI phòng thủ Vanish vào Ener. SIGNI tấn công vẫn trên bàn và downed. Không mất Life Cloth do battle cơ bản. |
| Lane và Guard | SIGNI tấn công qua lane trống. Sau đó Center LRIG tấn công, đối thủ có Guard. | Đòn SIGNI gây damage. Đối thủ có thể discard Guard để ngăn damage từ đòn Center. |
| Life Burst | Damage crush lá trên cùng có Burst Icon. | Lá lật vào Check Zone. Chủ lá chọn kích hoạt hoặc bỏ qua, cuối cùng lá đến Ener. |
| Lá khiên cuối | Center có Double Crush đánh trúng khi đối thủ còn một Life Cloth. Đối thủ nhận damage lần nữa khi còn 0. | Đòn đầu chỉ crush một, trận tiếp tục. Damage kế tiếp làm đối thủ thua. |
| Crush khác Damage | Đối thủ có 0 Life Cloth. Một hiệu ứng chỉ ghi crush một Life Cloth. | Không có lá để crush và trận tiếp tục. |
| Lancer | SIGNI có Lancer Vanish đối thủ bằng battle, rồi so với một ca Vanish do ability. | Chỉ ca battle mới crush thêm một Life Cloth. |
| Freeze | Freeze một SIGNI upped, sau đó lá bị down bởi hiệu ứng. | Lá giữ trạng thái down trong Up Phase kế tiếp của chủ thể. Frozen hết ở cuối Up Phase. |
| Cost và effect | Một Action đòi discard hai lá làm cost, người chơi có một lá. Một hiệu ứng khác yêu cầu discard hai. | Action không dùng được. Hiệu ứng discard lá duy nhất nếu không có ngoại lệ. |
| Trigger ưu tiên | Hiệu ứng đưa Power một SIGNI về 0 đồng thời tạo một Auto đang chờ. | Kết thúc hiệu ứng, xử lý Vanish do kiểm tra luật, rồi giải quyết trigger theo thứ tự hợp lệ. |
| End Phase | Turn Player có tám lá, đối thủ có bảy lá khi đến bước giới hạn hand. | Turn Player chọn discard hai. Đối thủ giữ nguyên bảy lá. |
