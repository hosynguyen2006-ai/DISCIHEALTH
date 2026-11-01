DISCI - WEBSITE TINH (STATIC WEBSITE)

PHIEN BAN GIAO DIEN MOI
- Giao dien trang nguoi dung duoc lam moi theo mau tham khao: nen sang, xanh ngoc, the bo goc, bo cuc thoang va responsive.
- Thanh dieu huong tu dong danh dau trang hien tai; menu mobile co the mo/thu gon.
- Cac trang su dung chung bo mau va thanh phan giao dien.
- Trang Cong dong bo sung bang tin dang bai, thich, binh luan; nhom tap va thu thach van duoc giu.

CAC TRANG
- index.html: Trang chu/tong quan
- health.html: Suc khoe, BMI/TDEE, ho so kham
- workout.html: Lap lich, muc tieu, ghi nhan ket qua
- exercises.html va exercise-detail.html: Thu vien va huong dan bai tap
- progress.html: Bieu do, thong ke, chuoi ngay, huy hieu
- nutrition.html: Calo va thuc don
- shop.html va cart.html: San pham, tim kiem, gio hang, dat hang
- community.html: Bang tin, nhom, thu thach, tro ly hoi dap
- notifications.html: Nhac lich
- account.html: Dang ky, dang nhap, ho so
- vip.html: Tinh nang VIP, uu dai

DU LIEU VA GIOI HAN WEBSITE TINH
- Khong can SQL Server, khong can CSDL, khong can backend.
- Du lieu duoc luu trong localStorage cua trinh duyet tren thiet bi hien tai.
- Dang ky/dang nhap chi la mo phong phia trinh duyet, KHONG phai xac thuc an toan. Khong dung de luu mat khau that hay du lieu nhay cam.
- Don hang/thanhtoan khong ket noi cong thanh toan; thao tac dat hang chi luu lich su tren trinh duyet.
- AI tu the can HTTPS, quyen camera va Internet; ket qua chi la goi y co ban, khong phai danh gia y khoa.

CHAY LOCAL
Mo thu muc docs va mo index.html bang trinh duyet. De camera hoat dong on dinh, nen chay qua localhost hoac HTTPS.

XUAT BAN GITHUB PAGES
1. Dua noi dung thu muc docs vao repository.
2. Chay:
   git add docs
   git commit -m "Refresh DISCI static website UI"
   git push origin main
3. GitHub -> Settings -> Pages -> Branch main -> Folder /docs -> Save.
