<template>
<span class="page-loader"></span>
</template>

<script>
export default {
    data() { return {}},
    methods: {}
}
</script>
<style>
.preload{
    position: absolute;
    margin-top: 100px;
}
.loading-dot {
    float: right;
    color: #5c5c5c;
    font-weight: normal;
    margin-left: 2px;
}
.loading-text {
    float: left;
    color: #5c5c5c;
    font-weight: normal;
}
.page-loader {
    width: 200px;
    height: 140px;
    background: #8d2020;
    box-sizing: border-box;
    position: relative;
    border-radius: 8px;
    perspective: 1000px;
    zoom: 0.4;
  }

  .page-loader:before{
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    bottom: 10px;
    border-radius:8px;
    background: #f5f5f5  no-repeat;
    background-size: 60px 10px;
    background-image: 	linear-gradient(#ddd 100px, transparent 0) ,
              linear-gradient(#ddd 100px, transparent 0), 
              linear-gradient(#ddd 100px, transparent 0), 
              linear-gradient(#ddd 100px, transparent 0), 
              linear-gradient(#ddd 100px, transparent 0), 
              linear-gradient(#ddd 100px, transparent 0);
    
    background-position: 15px 30px , 15px 60px , 15px 90px, 
              105px 30px , 105px 60px , 105px 90px;
    box-shadow: 0 0 10px rgba(0,0,0,0.25);
  }
  .page-loader:after {
    content: '';
      position: absolute;
      width: calc(50% - 10px);
      right: 10px;
      top: 10px;
      bottom: 10px;
      border-radius: 8px;
      background: #fff no-repeat;
      background-size: 60px 10px;
      background-image: linear-gradient(#ddd 100px, transparent 0), 
              linear-gradient(#ddd 100px, transparent 0), 
              linear-gradient(#ddd 100px, transparent 0);
      background-position: 50% 30px ,50% 60px , 50%  90px;
      transform: rotateY(0deg );
      transform-origin: left center;
    animation: paging 1s linear infinite;
  }


  @keyframes paging {
    to {
      transform: rotateY( -180deg );
    }
  }

  .dot1 {
    animation: visibility 2s linear infinite;
   }
   
   @keyframes visibility {
    0% {
    opacity: 1;
    }
    65% {
    opacity: 1;
    }
    66% {
    opacity: 0;
    }
    100% {
    opacity: 0;
    }
   }
   
   .dot2 {
    animation: visibility2 2s linear infinite;
   }
   
   @keyframes visibility2 {
    0% {
     opacity: 0;
    }
    21% {
     opacity: 0;
    }
    22% {
     opacity: 1;
    }
    65% {
     opacity: 1;
    }
    66% {
     opacity: 0;
    }
    100% {
     opacity: 0;
    }
   }
   
   .dot3 {
    animation: visibility3 2s linear infinite;
   }
   
   @keyframes visibility3 {
    0% {
     opacity: 0;
    }
    43% {
     opacity: 0;
    }
    44% {
     opacity: 1;
    }
    65% {
     opacity: 1;
    }
    66% {
     opacity: 0;
    }
    100% {
     opacity: 0;
    }
   }
</style>