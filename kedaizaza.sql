-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 19 Des 2023 pada 12.01
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kedaizaza`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `category_id` char(7) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`category_id`, `name`) VALUES
('CTG-001', 'SABUN'),
('CTG-002', 'SAMPO'),
('CTG-003', 'MINUMAN GELAS');

-- --------------------------------------------------------

--
-- Struktur dari tabel `customers`
--

CREATE TABLE `customers` (
  `customer_id` char(7) NOT NULL,
  `name` varchar(25) NOT NULL,
  `address` varchar(30) NOT NULL,
  `no_telp` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `customers`
--

INSERT INTO `customers` (`customer_id`, `name`, `address`, `no_telp`) VALUES
('CUS-001', 'Konsumen Umum', 'none', 'none'),
('CUS-002', 'Hanif', 'Jl Dahlia', '08238383838');

-- --------------------------------------------------------

--
-- Struktur dari tabel `employees`
--

CREATE TABLE `employees` (
  `employee_id` char(7) NOT NULL,
  `name` varchar(20) NOT NULL,
  `position` enum('administrator','casier') NOT NULL,
  `address` varchar(30) NOT NULL,
  `no_telp` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `employees`
--

INSERT INTO `employees` (`employee_id`, `name`, `position`, `address`, `no_telp`) VALUES
('EMP-001', 'Hanif Admin', 'administrator', 'Jl Dahlia', '083726277777'),
('EMP-002', 'Hanif Casier', 'casier', 'Jl Dahlia', '092837373737');

-- --------------------------------------------------------

--
-- Struktur dari tabel `items`
--

CREATE TABLE `items` (
  `items_id` char(6) NOT NULL,
  `name` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL,
  `purchase_price` int(11) NOT NULL,
  `selling_price` int(11) NOT NULL,
  `satuan_id` int(11) NOT NULL,
  `category_id` char(7) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `items`
--

INSERT INTO `items` (`items_id`, `name`, `stock`, `purchase_price`, `selling_price`, `satuan_id`, `category_id`) VALUES
('001001', 'Head & Shoulder', 104, 908, 1000, 9, 'CTG-001'),
('001002', 'Sunsilk', 144, 921, 1000, 9, 'CTG-001'),
('003001', 'Torpedo', 20, 1100, 1500, 9, 'CTG-003');

-- --------------------------------------------------------

--
-- Struktur dari tabel `purchases`
--

CREATE TABLE `purchases` (
  `purchase_id` char(11) NOT NULL,
  `no_nota` varchar(15) NOT NULL,
  `supplier_id` char(7) NOT NULL,
  `employee_id` char(7) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment` int(11) NOT NULL,
  `status` enum('LUNAS','BELUM LUNAS') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `purchases`
--

INSERT INTO `purchases` (`purchase_id`, `no_nota`, `supplier_id`, `employee_id`, `date`, `payment`, `status`) VALUES
('PRC-0000001', 'aslkdjakjsdl', 'SUP-001', 'EMP-001', '2023-12-08 09:36:21', 1000000, 'LUNAS'),
('PRC-0000002', 'aslkdjakjsdl', 'SUP-001', 'EMP-001', '2023-12-08 09:36:53', 1000000, 'LUNAS');

-- --------------------------------------------------------

--
-- Struktur dari tabel `purchase_details`
--

CREATE TABLE `purchase_details` (
  `purchase_id` char(11) NOT NULL,
  `items_id` char(6) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `purchase_details`
--

INSERT INTO `purchase_details` (`purchase_id`, `items_id`, `quantity`, `price`) VALUES
('PRC-0000001', '001001', 20, 1000),
('PRC-0000001', '001002', 30, 1000),
('PRC-0000002', '001002', 30, 1000),
('PRC-0000002', '001001', 20, 1000);

-- --------------------------------------------------------

--
-- Struktur dari tabel `sales`
--

CREATE TABLE `sales` (
  `sale_id` char(11) NOT NULL,
  `customer_id` char(7) NOT NULL,
  `employee_id` char(7) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('LUNAS','BELUM LUNAS') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sales`
--

INSERT INTO `sales` (`sale_id`, `customer_id`, `employee_id`, `date`, `status`) VALUES
('08122023001', 'CUS-001', 'EMP-001', '2023-12-08 10:46:09', 'LUNAS'),
('08122023002', 'CUS-001', 'EMP-001', '2023-12-08 16:10:56', 'LUNAS');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sale_details`
--

CREATE TABLE `sale_details` (
  `sale_id` char(11) NOT NULL,
  `items_id` char(6) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `status` enum('LUNAS','BELUM LUNAS') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sale_details`
--

INSERT INTO `sale_details` (`sale_id`, `items_id`, `quantity`, `price`, `status`) VALUES
('08122023001', '001001', 20, 1000, 'LUNAS'),
('08122023001', '001002', 30, 1000, 'LUNAS'),
('08122023002', '001002', 30, 1000, 'LUNAS'),
('08122023002', '001001', 20, 1000, 'LUNAS');

-- --------------------------------------------------------

--
-- Struktur dari tabel `satuan`
--

CREATE TABLE `satuan` (
  `satuan_id` int(11) NOT NULL,
  `name` varchar(7) NOT NULL,
  `turunan` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `satuan`
--

INSERT INTO `satuan` (`satuan_id`, `name`, `turunan`) VALUES
(8, 'dus', 'pcs'),
(9, 'pcs', 'pcs'),
(10, 'liter', 'liter'),
(11, 'renteng', 'pcs'),
(12, 'kg', 'g'),
(13, 'g', 'g');

-- --------------------------------------------------------

--
-- Struktur dari tabel `suppliers`
--

CREATE TABLE `suppliers` (
  `supplier_id` char(7) NOT NULL,
  `name` varchar(30) NOT NULL,
  `address` varchar(30) NOT NULL,
  `agen` varchar(30) NOT NULL,
  `no_telp` varchar(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `suppliers`
--

INSERT INTO `suppliers` (`supplier_id`, `name`, `address`, `agen`, `no_telp`) VALUES
('SUP-001', 'mayora', 'jl mayora', 'jett', '082373737373'),
('SUP-002', 'indomarcs', 'jl indomarcos', 'viper', '9090912');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `uid` char(7) NOT NULL,
  `username` char(16) NOT NULL,
  `employee_id` char(7) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`uid`, `username`, `employee_id`, `password`) VALUES
('0000001', 'niph', 'EMP-001', '$2b$11$FueU6MJPs16mOVb6Gi51DeLQemkoI6YLVRdOjmHjUoYwec6dgmAL6');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indeks untuk tabel `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`customer_id`);

--
-- Indeks untuk tabel `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`);

--
-- Indeks untuk tabel `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`items_id`),
  ADD KEY `satuan_id` (`satuan_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeks untuk tabel `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`purchase_id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indeks untuk tabel `purchase_details`
--
ALTER TABLE `purchase_details`
  ADD KEY `purchase_id` (`purchase_id`),
  ADD KEY `items_id` (`items_id`);

--
-- Indeks untuk tabel `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`sale_id`);

--
-- Indeks untuk tabel `sale_details`
--
ALTER TABLE `sale_details`
  ADD KEY `sale_id` (`sale_id`),
  ADD KEY `items_id` (`items_id`);

--
-- Indeks untuk tabel `satuan`
--
ALTER TABLE `satuan`
  ADD PRIMARY KEY (`satuan_id`);

--
-- Indeks untuk tabel `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`supplier_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `satuan`
--
ALTER TABLE `satuan`
  MODIFY `satuan_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`satuan_id`) REFERENCES `satuan` (`satuan_id`),
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Ketidakleluasaan untuk tabel `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`supplier_id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);

--
-- Ketidakleluasaan untuk tabel `purchase_details`
--
ALTER TABLE `purchase_details`
  ADD CONSTRAINT `purchase_details_ibfk_1` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`purchase_id`),
  ADD CONSTRAINT `purchase_details_ibfk_2` FOREIGN KEY (`items_id`) REFERENCES `items` (`items_id`);

--
-- Ketidakleluasaan untuk tabel `sale_details`
--
ALTER TABLE `sale_details`
  ADD CONSTRAINT `sale_details_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`sale_id`),
  ADD CONSTRAINT `sale_details_ibfk_2` FOREIGN KEY (`items_id`) REFERENCES `items` (`items_id`);

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
