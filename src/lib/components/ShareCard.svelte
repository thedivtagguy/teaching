<script lang="ts">
	export let title = 'Data Visualization Course';
	export let date = '';
	
	$: formattedDate = date 
		? new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
		: new Date().toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	export let courseId = '';
	export let type = 'page';

	$: bgColor = type === 'assignment' ? '#4D80E6' : type === 'day' ? '#92DE86' : '#F8FBF8';
	$: textColor = type === 'assignment' ? '#F8FBF8' : type === 'day' ? '#2B2B2B' : '#2B2B2B';
	$: accentColor = type === 'assignment' ? '#F8FBF8' : type === 'day' ? '#2B2B2B' : '#4D80E6';
</script>

<div
	style="display: flex; width: 1200px; height: 627px; color: {textColor}; font-family: 'LibreCaslonCondensed', serif; position: relative;"
>
	<img
		src="http://teaching.aman.bh/assets/sharecard.jpg"
		alt=""
		style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
	/>

	<div
		style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: {bgColor}; opacity: 0.7;"
	></div>

	<div
		style="display: flex; flex-direction: column; flex: 1; width: 100%; height: 100%; position: relative; padding: 40px 150px; border: 4px solid {accentColor};  box-shadow: 0 8px 0 0 {accentColor ===
		'#F8FBF8'
			? '#2B2B2B'
			: accentColor}, 0 8px 20px 0 rgba(43, 43, 43, 0.3);"
	>
		<div style="display: flex; justify-content: space-between; align-items: flex-start;">
			<div style="display: flex;">
				<span
					style="font-size: 36px; font-weight: bold; text-transform: uppercase; color: {accentColor}; font-family: 'Libre Cas', sans-serif; letter-spacing: 2px;"
					>{courseId}</span
				>
			</div>
			<div style="display: flex;">
				<span
					style="font-size: 30px; background-color: {accentColor}; color: {bgColor}; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-family: 'Libre Cas', sans-serif; letter-spacing: 1px; border: 2px solid {textColor}; box-shadow: 0 3px 0 0 {textColor};"
				>
					{type === 'assignment' ? 'ASSIGNMENT' : type === 'day' ? 'READING' : 'COURSE'}
				</span>
			</div>
		</div>

		<div
			style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; align-items: center;"
		>
			<div style="display: flex; text-align: center;">
				<span
					style="font-size: 72px; font-weight: bold; line-height: 1.1; max-width: 90%; text-shadow: 2px 2px 0 {accentColor ===
					textColor
						? bgColor
						: 'rgba(43, 43, 43, 0.3)'};">{title}</span
				>
			</div>
		</div>

		<div
			style="display: flex; justify-content: space-between; align-items: center; border-top: 4px solid {accentColor}; padding-top: 20px;  margin: 0 -20px -20px -20px; padding: 20px 0px; border-radius: 0 0 8px 8px;"
		>
			<div style="display: flex;">
				<span
					style="font-size: 36px; font-family: 'Archivo Variable', sans-serif; font-weight: 600;"
					>{formattedDate}</span
				>
			</div>
			<div style="display: flex;">
				<span
					style="font-size: 36px; font-weight: bold; color: {textColor}; font-family: 'Libre Cas', sans-serif; letter-spacing: 1px;"
					>teaching.aman.bh/{courseId}</span
				>
			</div>
		</div>
	</div>
</div>
