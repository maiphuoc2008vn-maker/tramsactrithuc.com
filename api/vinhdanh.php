<?php
// 1. KẾT NỐI DATABASE
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "websitelop12_db"; // Tên database của bạn

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) { die("Lỗi kết nối: " . $conn->connect_error); }
$conn->set_charset("utf8mb4");

// 2. LẤY DỮ LIỆU
$sql = "SELECT * FROM users ORDER BY diem DESC";
$result = $conn->query($sql);

$danhSach = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $danhSach[] = $row;
    }
}
$conn->close();

// 3. CHIA TOP
$top1 = isset($danhSach[0]) ? $danhSach[0] : null;
$top2 = isset($danhSach[1]) ? $danhSach[1] : null;
$top3 = isset($danhSach[2]) ? $danhSach[2] : null;

function formatDiem($n) { return number_format($n); }
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vinh Danh - STEAM 12A4</title>
    <link rel="stylesheet" href="vinhdanh.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>

    <!-- HEADER -->
    <header class="main-header">
        <div class="logo-container">
            <img src="../images/logotruong.jpg" alt="Logo" class="header-logo" onerror="this.src='https://via.placeholder.com/40'">
            <h1 class="brand-name">THPT ĐẠM RI - 12A4</h1>
        </div>
        
        <nav class="main-nav">
            <a href="index.php" class="nav-item"><i class="fas fa-home"></i> Trang chủ</a>
            <a href="#" class="nav-item active"><i class="fas fa-trophy"></i> Vinh danh</a>
            <a href="game/game.html" class="nav-item"><i class="fas fa-gamepad"></i> Game</a>
            
            <!-- Nút đổi chế độ Sáng/Tối -->
            <button id="theme-toggle" class="theme-btn" title="Chế độ Sáng/Tối">
                <i class="fas fa-moon"></i>
            </button>
        </nav>
    </header>

    <!-- MAIN -->
    <main class="vinhdanh-container">
        <div class="page-title">
            <h1><i class="fas fa-crown text-warning"></i> BẢNG PHONG THẦN <i class="fas fa-crown text-warning"></i></h1>
            <p>Vinh danh những chiến thần tri thức tuần này</p>
        </div>

        <!-- BỤC VINH QUANG -->
        <div class="podium-section">
            <!-- TOP 2 -->
            <?php if ($top2): ?>
            <div class="podium-col rank-2">
                <div class="avatar-wrapper">
                    <img src="<?php echo $top2['avatar']; ?>" onerror="this.src='https://via.placeholder.com/100/bdc3c7/fff?text=TOP2'">
                    <div class="badge-rank silver">2</div>
                </div>
                <div class="podium-stand">
                    <div class="rank-name"><?php echo $top2['username']; ?></div>
                    <div class="rank-score"><?php echo formatDiem($top2['diem']); ?> XP</div>
                </div>
            </div>
            <?php endif; ?>

            <!-- TOP 1 -->
            <?php if ($top1): ?>
            <div class="podium-col rank-1">
                <div class="floating-reward">
                    <i class="fas fa-trophy trophy-anim"></i>
                </div>
                <div class="avatar-wrapper">
                    <img src="<?php echo $top1['avatar']; ?>" onerror="this.src='https://via.placeholder.com/100/f1c40f/fff?text=TOP1'">
                    <div class="badge-rank gold">1</div>
                </div>
                <div class="podium-stand">
                    <div class="winner-label"><?php echo !empty($top1['danh_hieu']) ? $top1['danh_hieu'] : "👑 NHÀ VÔ ĐỊCH"; ?></div>
                    <div class="rank-name"><?php echo $top1['username']; ?></div>
                    <div class="rank-score"><?php echo formatDiem($top1['diem']); ?> XP</div>
                </div>
            </div>
            <?php endif; ?>

            <!-- TOP 3 -->
            <?php if ($top3): ?>
            <div class="podium-col rank-3">
                <div class="avatar-wrapper">
                    <img src="<?php echo $top3['avatar']; ?>" onerror="this.src='https://via.placeholder.com/100/cd7f32/fff?text=TOP3'">
                    <div class="badge-rank bronze">3</div>
                </div>
                <div class="podium-stand">
                    <div class="rank-name"><?php echo $top3['username']; ?></div>
                    <div class="rank-score"><?php echo formatDiem($top3['diem']); ?> XP</div>
                </div>
            </div>
            <?php endif; ?>
        </div>

        <!-- BẢNG CHI TIẾT -->
        <section class="leaderboard-section">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th width="10%">#</th>
                            <th>Thành viên</th>
                            <th>Danh hiệu</th>
                            <th>Điểm số</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $count = count($danhSach);
                        if ($count > 3):
                            for ($i = 3; $i < $count; $i++): 
                                $u = $danhSach[$i];
                        ?>
                        <tr>
                            <td><?php echo $i + 1; ?></td>
                            <td><?php echo $u['username']; ?></td>
                            <td>
                                <?php if(!empty($u['mo_ta'])): ?>
                                    <span class="tag-title"><?php echo $u['mo_ta']; ?></span>
                                <?php endif; ?>
                            </td>
                            <td><?php echo formatDiem($u['diem']); ?></td>
                        </tr>
                        <?php endfor; endif; ?>
                    </tbody>
                </table>
            </div>
        </section>
    </main>

    <!-- JAVASCRIPT ĐỔI GIAO DIỆN -->
    <script>
        const btn = document.getElementById('theme-toggle');
        const icon = btn.querySelector('i');
        const body = document.body;

        // Kiểm tra lịch sử
        if (localStorage.getItem('theme') === 'light') {
            body.classList.add('light-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
        }

        btn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                icon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    </script>
</body>
</html>