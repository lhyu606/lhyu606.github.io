-- 报备表
CREATE TABLE IF NOT EXISTS `bao_bei` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
	`baobeihao` VARCHAR(255) NOT NULL COMMENT '报备号',
	`date` VARCHAR(255) NOT NULL COMMENT '报备日期',
	`shopName` VARCHAR(255) NOT NULL COMMENT '事务所名称',
	`uname` VARCHAR(255) NOT NULL COMMENT '客户名称',
	`baogaohao` VARCHAR(255) NOT NULL COMMENT '报告文号',
	`zhushif` VARCHAR(255) NOT NULL COMMENT '签字注师一',
	`zhushis` VARCHAR(255) NOT NULL COMMENT '签字注师二',
	`yijian` VARCHAR(255) NOT NULL COMMENT '报告意见',
	`update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;

-- 税务
CREATE TABLE IF NOT EXISTS `shui_wu` (
	`id` INT(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
	`source` VARCHAR(255) NOT NULL COMMENT '来源',
	`wenShu` VARCHAR(255) NOT NULL COMMENT '文书编号',
	`naShuiId` VARCHAR(255) NOT NULL COMMENT '纳税人识别号',
	`naShuiName` VARCHAR(255) NOT NULL COMMENT '纳税人名称',
	`stockStart` DATE NOT NULL COMMENT '入退库日期始',
	`stockEnd` DATE NOT NULL COMMENT '入退库日期止',
	`naShuiDate` DATE NOT NULL COMMENT '开具日期',
	`totle` DECIMAL(20,2) NULL DEFAULT '0.00' COMMENT '合计金额',
	`totleBig` VARCHAR(255) NOT NULL COMMENT '合计金额大写',
	`taxItem` VARCHAR(255) NOT NULL COMMENT '纳税项目',
	`taxPaid` DECIMAL(20,2) NULL DEFAULT '0.00' COMMENT '实缴税款',
	`taxReturn` DECIMAL(20,2) NULL DEFAULT '0.00' COMMENT '实退金额',
	`taxPaidReturn` VARCHAR(255) NOT NULL COMMENT '缴(退)金额合计',
	`update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '更新时间',
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;
