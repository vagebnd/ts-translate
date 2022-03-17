<template>
  <div>
    <button type="button" :title="$tc('Vue test translations string')" @click="myAction">
    <p>{{ $t('Second translation') }}</p>
    <h1>{{ $t('Third translation') }}</h1>
    <p>In this part we test that the {{ $t('Third translation') }} is only once in the results.</p>
  </div>
</template>
