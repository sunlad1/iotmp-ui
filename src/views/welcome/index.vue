<template>
  <div class="welcomContainer">
		<div class="textgrid">
			<span>欢迎进入首页</span>
			<span>您可通过菜单栏查看更多平台信息>></span>
		</div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
.welcomContainer {
  width: 100vw;
  height: 100vh;
  background-image: url(/static/imgs/loginPage/welcomeBk.png);
  background-size: 100% 100%;
	background-repeat: no-repeat;
	padding-left: 225px;
	.textgrid{
		display: flex;
		flex-direction: column;
		padding-left: .89rem;
		padding-top: .96rem;
		span:nth-child(1){
			color: #00C3FF;
			font-size: .173rem;
		}
		span:nth-child(2){
			padding-top: .228rem;
			color: #2DA2FD;
			font-size: .125rem;
		}
	}
}
</style>