<script>
	export let title = 'Data Visualization Course';
	export let date = new Date().toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
	export let courseId = '';
	export let type = 'page';

	// Color theme for different page types using course colors
	$: bgColor = type === 'assignment' ? '#4D80E6' : type === 'day' ? '#92DE86' : '#F8FBF8';
	$: textColor = type === 'assignment' ? '#F8FBF8' : type === 'day' ? '#2B2B2B' : '#2B2B2B';
	$: accentColor = type === 'assignment' ? '#F8FBF8' : type === 'day' ? '#2B2B2B' : '#4D80E6';
</script>

<div
	style="display: flex; width: 1200px; height: 830px; color: {textColor}; font-family: 'Libre Caslon Condensed', serif; position: relative;"
>
	<!-- Background image (bottom layer) -->
	<img
		src="http://teaching.aman.bh/assets/sharecard.jpg"
		alt=""
		style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
	/>

	<!-- Colored background overlay (middle layer) -->
	<div
		style="display: flex; flex-direction: column; justify-content: center; align-items: center; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: {bgColor}; opacity: 0.7;"
	></div>

	<!-- Content wrapper (top layer) -->
	<div
		style="display: flex; flex-direction: column; flex: 1; width: 100%; height: 100%; position: relative; padding: 60px;"
	>
		<!-- Header with course ID if available -->
		<div style="display: flex; justify-content: space-between; align-items: flex-start;">
			<div style="display: flex;">
				<span
					style="font-size: 28px; font-weight: bold; text-transform: uppercase; color: {accentColor};"
					>{courseId}</span
				>
			</div>
			<div style="display: flex;">
				<span
					style="font-size: 20px; background-color: {accentColor}; color: {bgColor}; padding: 8px 16px; border-radius: 8px; font-weight: bold;"
				>
					{type === 'assignment' ? 'ASSIGNMENT' : type === 'day' ? 'READING' : 'COURSE'}
				</span>
			</div>
		</div>

		<!-- Main content area -->
		<div
			style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; align-items: center;"
		>
			<div style="display: flex; text-align: center;">
				<span style="font-size: 72px; font-weight: bold; line-height: 1.1; max-width: 90%;"
					>{title}</span
				>
			</div>
		</div>

		<!-- Footer with date and website -->
		<div
			style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid {accentColor}; padding-top: 20px;"
		>
			<div style="display: flex;">
				<span style="font-size: 24px;">{date}</span>
			</div>
			<div style="display: flex;">
				<span style="font-size: 28px; font-weight: bold; color: {textColor};"
					>teaching.aman.bh/{courseId}</span
				>
			</div>
		</div>
	</div>
</div>
