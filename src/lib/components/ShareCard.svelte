<script>
	import { base } from '$app/paths';
	export let title = 'Data Visualization Course';
	export let date = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
</script>

<div
	style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #f8fafc; color: #0f172a; padding: 60px; justify-content: center; align-items: center; font-family: Arial, sans-serif; background-image: url({base}/assets/sharecard.jpg); background-size: cover; background-position: center;"
>
	<div style="display: flex;">
		<span style="font-size: 80px; font-weight: bold;">{title}</span>
	</div>
	<div style="display: flex; margin-top: 20px;">
		<span style="font-size: 24px;">{date}</span>
	</div>
</div>
