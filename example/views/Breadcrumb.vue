<template>
	<div>
    <h1>基础用法</h1>
    <h-breadcrumb>
      <h-breadcrumb-item href="/">Home</h-breadcrumb-item>
      <h-breadcrumb-item href="/menu">Components</h-breadcrumb-item>
      <h-breadcrumb-item>Breadcrumb</h-breadcrumb-item>
    </h-breadcrumb> 
    <h1>基础用法</h1>
    <h-breadcrumb>
      <h-breadcrumb-item href="/">
        <h-icon name="homepage"></h-icon> Home
      </h-breadcrumb-item>
      <h-breadcrumb-item href="/menu">
        <h-icon name="android-folder-open"></h-icon> Components
      </h-breadcrumb-item>
      <h-breadcrumb-item>
        <h-icon name="document"></h-icon> Breadcrumb
      </h-breadcrumb-item>
    </h-breadcrumb>
    <h-breadcrumb separator=">">
      <h-breadcrumb-item href="/">Home</h-breadcrumb-item>
      <h-breadcrumb-item href="/components/breadcrumb">Components</h-breadcrumb-item>
      <h-breadcrumb-item>Breadcrumb</h-breadcrumb-item>
    </h-breadcrumb>
    <h-breadcrumb separator="<b class='demo-breadcrumb-separator'>=></b>">
      <h-breadcrumb-item href="/">Home</h-breadcrumb-item>
      <h-breadcrumb-item href="/components/breadcrumb">Components</h-breadcrumb-item>
      <h-breadcrumb-item>Breadcrumb</h-breadcrumb-item>
    </h-breadcrumb>
  </div>
</template>
<script>
  export default {
      
  }
</script>
<style type="text/css">
	.demo-breadcrumb-separator{
    color: #ff5500;
    padding: 0 5px;
  }
</style>