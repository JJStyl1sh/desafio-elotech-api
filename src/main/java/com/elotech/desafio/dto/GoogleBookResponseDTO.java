package com.elotech.desafio.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record GoogleBookResponseDTO(List<ItemDTO> items) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record ItemDTO(VolumeInfoDTO volumeInfo){}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record VolumeInfoDTO(
            String title,
            List<String> authors,
            String publishedDate,
            List<String> categories,
            List<IndustryIdentifierDTO> industryIdentifiers
    ){}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record IndustryIdentifierDTO(
            String type,
            String identifier
    ){}


}
