<script>
import {defineComponent} from 'vue'
import axios from "axios";

export default defineComponent({
    name: "HomeContainer",
})
</script>

<template>
    <div class="homeContainer">
        <div class="last">
<!--            <div class="coverImage"><img src="https://aforismi.meglio.it/img/film/armageddon.jpg" class="card-img" alt=""></div>-->
<!--            <div class="coverImage"><img :src="movie.poster" class="card-img" alt="" @error="replaceByDefault"></div>
            <div class="pattern"></div>-->
            <div class="coverText">
                <div>
                    <h1>Gestione Presenze Aule</h1>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
<!--        <div class="container-fluid">
        </div>
-->
    </div>

</template>

<style>
.homeContainer{
    margin-bottom: 200px;
}
.last{
    margin:50px;
    border-radius: 30px;
    box-sizing: border-box;
    overflow: hidden;
}
.last>*{
    width:100%;
    height: 500px;
}
.coverImage{
    filter: blur(5px);
    position: relative;
    overflow:hidden;
    margin-bottom: -500px;
}
.coverImage img{
    margin-top: -200px;
}
.pattern{
    position: relative;
    background-image: url('https://pngimg.com/uploads/dot/dot_PNG4.png');
    background-repeat: repeat;
    background-size: 5px;
    opacity: 0.5;
    margin-bottom: -500px;
}
.coverText{
    justify-content: center;
    align-items: center;
    position: relative;
    display: flex;
    flex-direction: column;
    color: white;
}
.coverText div{
    background: rgba(0,0,0,0.8);
    border-radius: 10px;
    margin: auto;
    padding: 20px 40px;
    text-align: center;
}
.filmCard{
    width: 30%;
    box-sizing: border-box;
    margin-left: 2%;
    height: 200px;
    display: inline-flex;
    flex-direction: row;
    border: 1px solid gray;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f5f5f5;
}
.filmCard h1{
    font-size: 22px;
}
.filmCardImg{
    height: 100%;
}
.filmCardImg img{
    height: 100%;
    width: auto;
}
.filmCardTxt{
    padding: 2px;
}

</style>