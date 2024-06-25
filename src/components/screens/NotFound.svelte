<script lang="ts">
    import SomethingLost from "@/assets/images/something-lost.png"
	import Button from '$components/controllers/Button.svelte'
</script>

<div class="full-screen text-center">
    <img src={SomethingLost} alt="something lost">

    <h1>Страница не найдена</h1>

    <Button className="mt-5 !bg-transparent !text-primary" onClick={() => {window.history.back()}}>
        <span class="fa-solid fa-arrow-left-long"></span>
        <span>Назад</span>
    </Button>
</div>