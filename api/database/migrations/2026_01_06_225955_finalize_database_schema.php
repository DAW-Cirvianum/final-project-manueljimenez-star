<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Solo añadimos lo que NO está en la tabla users aún
        Schema::table('users', function (Blueprint $table) {
            $table->integer('reputation_score')->default(0);
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
        });

        // Solo añadimos lo que NO está en la tabla contents aún
        Schema::table('contents', function (Blueprint $table) {
            $table->string('duration')->nullable();
            $table->string('cover_image')->nullable();
        });

        // Creamos las tablas nuevas
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('content_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'content_id']);
        });

        Schema::create('review_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('review_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['user_id', 'review_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
