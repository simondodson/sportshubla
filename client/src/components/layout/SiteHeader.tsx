import React, { FC } from 'react';
// import { Team } from '../../interfaces/team';
import { Box, Image } from '@chakra-ui/core';

type Props = {
  // teams: Team[];
};

const SiteHeader: FC<Props> = () => {
  return (
    <Box w="100%" p={2} bg="gray.800">
      <Image
        src="/images/logo/logo-transparent.png"
        alt="logo"
        title="logo"
        height="30px"
        ignoreFallback
      />
    </Box>
  );
};

export default SiteHeader;