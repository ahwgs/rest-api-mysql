

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_posts
-- ----------------------------
DROP TABLE IF EXISTS `t_posts`;
CREATE TABLE `t_posts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `post_author` bigint(255) NOT NULL,
  `post_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `post_content` longtext COLLATE utf8mb4_german2_ci NOT NULL,
  `post_title` text COLLATE utf8mb4_german2_ci NOT NULL,
  `post_excerpt` text COLLATE utf8mb4_german2_ci NOT NULL,
  `post_tag` int(255) NOT NULL,
  `post_status` varchar(20) COLLATE utf8mb4_german2_ci NOT NULL,
  `post_type` varchar(20) COLLATE utf8mb4_german2_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

-- ----------------------------
-- Records of t_posts
-- ----------------------------
INSERT INTO `t_posts` VALUES ('1', '1', '2018-12-15 02:08:11', '你好的', '', '', '0', '', '');

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_german2_ci NOT NULL DEFAULT '',
  `email` varchar(255) COLLATE utf8mb4_german2_ci NOT NULL DEFAULT '',
  `password` varchar(255) COLLATE utf8mb4_german2_ci NOT NULL DEFAULT '',
  `avatar` varchar(255) COLLATE utf8mb4_german2_ci NOT NULL,
  `createTime` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `identity` int(255) unsigned NOT NULL DEFAULT '1' COMMENT '1超级管理员',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_german2_ci;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES ('8', 'ahwgs', '994705960@qq.com', '$2b$10$Zcduup3bKYBbeLkRb5fLjOnff/kPyrS3Hjx0xH6R5YkUrQy.vtDIC', '//www.gravatar.com/avatar/f79c87d812c09d1c28162a66dcaf94ae?s=200&r=pg&d=mm', '2018-12-15 01:54:30', '1');
INSERT INTO `t_user` VALUES ('9', 'ahwgs', 'ah_wgs@126.com', '$2b$10$Io/GP3iQsQaSQ.bbswAKTerqr/u9Jp/iv3H1MOOSTSbhyOeuSUT2K', '//www.gravatar.com/avatar/bcbf5e084365303cfd7520664afbb4dd?s=200&r=pg&d=mm', '2018-12-15 01:54:32', '1');
