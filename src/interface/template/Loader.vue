<script>
export default {
	name: 'Loader',
	components: {},
	methods: {},
};
</script>

<template>
<div class="">
  <div class="z-10 min-h-full w-full absolute top-0 overscroll-none bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8 loading-screen">
    <div class="mx-auto max-w-max">
      <main class="sm:flex">
        <div class="sm:ml-6">
          <div class="text-center">
            <h3 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
              <div class="text-center">กำลังโหลดข้อมูล</div>
            </h3>
            <p class="mt-1 text-base text-gray-500">ระบบกำลังโหลดข้อมูล กรุณารอสักครู่.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</div>
</template>

<style scoped>
.lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 33px;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #ff5252;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 8px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 8px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 32px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 56px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(24px, 0);
    }
  }
</style>
